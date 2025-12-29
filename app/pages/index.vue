<template>
  <div class="character-sheet-container min-h-screen p-8" :style="backgroundStyle">
    <!-- 导入/导出按钮 -->
    <div class="flex justify-center gap-3 mb-4">
      <button 
        @click="handleClearAll"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
        🗑️ 清空全部
      </button>
      <button 
        @click="handleImport"
        class="px-4 py-2 bg-[#8b7ba8] text-white rounded-lg hover:bg-[#7a6a98] transition-colors text-sm">
        📥 載入角色
      </button>
      <button 
        @click="store.exportData()"
        class="px-4 py-2 bg-[#8b7ba8] text-white rounded-lg hover:bg-[#7a6a98] transition-colors text-sm">
        📤 匯出角色
      </button>
      <input 
        ref="fileInput" 
        type="file" 
        accept=".json" 
        @change="onFileSelected" 
        class="hidden" />
    </div>
    
    <div class="character-sheet max-w-[1600px] mx-auto bg-[#f5f0e8] shadow-2xl rounded-lg overflow-hidden">
      <!-- 主要內容區域 -->
      <div class="grid grid-cols-12 gap-0">
        
        <!-- 左側欄 - Society, Academia, War, Street -->
        <div class="col-span-3 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- 技能區塊循環 -->
          <div 
            v-for="category in skillCategories" 
            :key="category.id"
            class="skill-section relative" 
            :style="{
              backgroundImage: `url('${category.backgroundImage}')`,
              backgroundSize: 'auto 85%',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat'
            }">
            <div class="flex items-center gap-2 relative z-10 pl-6 md:pl-7">
              <h2 class="text-lg md:text-xl text-[#5a4a3a] whitespace-nowrap">{{ category.title }}</h2>
              <img v-for="i in 2" :key="i" 
                   :src="i <= category.level ? assetPath(`/assets/sheet/${category.icon}-filled.svg`) : assetPath(`/assets/sheet/${category.icon}.svg`)" 
                   class="w-5 md:w-6 cursor-pointer hover:scale-110 transition-transform flex-shrink-0" 
                   :alt="category.icon" 
                   @click="toggleCategoryLevel(category.id, i)" />
            </div>
            <img :src="assetPath('/assets/sheet/deco2.svg')" class="pb-2"/>
            <div v-for="skill in category.skills" :key="skill.name" class="flex items-center justify-between gap-2 mb-1 text-sm relative z-10">
              <div class="skill-tooltip-container relative flex-1 min-w-0 pl-16 md:pl-20">
                <span class="text-[#5a4a3a] uppercase text-base md:text-lg cursor-help whitespace-nowrap overflow-hidden text-ellipsis block">{{ skill.name_cn }}</span>
                <div class="skill-tooltip">
                  <div class="text-xs">{{ skill.description }}</div>
                </div>
              </div>
              <div class="flex gap-1 flex-shrink-0 pr-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? assetPath(`/assets/sheet/${category.icon}-filled.svg`) : assetPath(`/assets/sheet/${category.icon}.svg`)" 
                     class="w-3.5 md:w-4 cursor-pointer hover:scale-110 transition-transform" 
                     alt="Level" 
                     @click="toggleSkillLevel(category.id, skill.name, i)" />
              </div>
            </div>
          </div>

          <!-- Equipment & Wealth -->
          <div class="skill-section border border-[#8b7355] rounded" style="overflow: visible;">
            <!-- 标题栏 -->
            <div class="bg-[#f9f6f0] border-b border-[#8b7355] px-3 py-2">
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-base font-serif text-[#5a4a3a]">裝備 & 財富</h2>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-[#5a4a3a]">硬幣</span>
                  <input type="number" min="0" v-model="store.coins" class="w-12 h-7 rounded-full border-2 border-[#8b7355] bg-white text-center text-xs focus:outline-none focus:ring-1 focus:ring-[#8b7355]" placeholder="0" />
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="grid grid-cols-4 gap-x-2 gap-y-1 text-xs">
                  <label class="flex items-center gap-1">
                    <input type="radio" name="wealth" value="poor" v-model="store.wealthLevel" class="w-3 h-3" />
                    <span class="text-[#5a4a3a]">貧困</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="wealth" value="well-off" v-model="store.wealthLevel" class="w-3 h-3" />
                    <span class="text-[#5a4a3a]">小康</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="wealth" value="middle" v-model="store.wealthLevel" class="w-3 h-3" />
                    <span class="text-[#5a4a3a]">中產</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="wealth" value="rich" v-model="store.wealthLevel" class="w-3 h-3" />
                    <span class="text-[#5a4a3a]">富有</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 内容区域 -->
            <div class="bg-[#e8e3db] p-2 relative">
              <!-- 編輯/預覽切換按鈕 -->
              <button 
                @click="equipmentEditMode = !equipmentEditMode"
                class="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-[#8b7ba8] text-white hover:bg-[#7a6a98] transition-colors z-10 shadow-sm">
                {{ equipmentEditMode ? '預覽' : '編輯' }}
              </button>
              
              <!-- 編輯模式 -->
              <textarea 
                v-if="equipmentEditMode"
                v-model="store.equipmentText"
                class="w-full bg-transparent text-xs px-2 py-1 pr-16 focus:outline-none resize-none font-mono leading-relaxed equipment-textarea border-0" 
                rows="15"
                placeholder="輸入裝備，例如：&#10;鑰匙｜價格 2&#10;特性：沉重&#10;單手武器，鑰齒由堅硬金屬製成。"></textarea>
              
              <!-- 預覽模式 -->
              <div v-else class="space-y-1 min-h-[300px] pr-14">
                <div 
                  v-for="(item, index) in parsedEquipment" 
                  :key="index"
                  @click="copyToClipboard(item)"
                  class="text-xs px-2 py-1 hover:bg-[#d8d3cb] rounded cursor-pointer transition-colors"
                  :title="'點擊複製'">
                  <span class="font-semibold text-[#5a4a3a]">{{ item.name }}</span>
                  <template v-if="item.traits.length > 0">
                    <span class="text-[#8b7355]">，</span>
                    <span 
                      v-for="(trait, tIndex) in item.traits" 
                      :key="tIndex"
                      class="weapon-trait-container">
                      <span class="text-[#8b7355]">{{ trait }}</span>
                      <div class="weapon-trait-tooltip">
                        {{ getWeaponTraitDescription(trait) }}
                      </div>
                      <span v-if="tIndex < item.traits.length - 1" class="text-[#8b7355]">、</span>
                    </span>
                  </template>
                </div>
                <div v-if="parsedEquipment.length === 0" class="text-xs text-[#8b7355] px-2 py-4 text-center opacity-50">
                  點擊「編輯」按鈕輸入裝備
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中間欄 - Aces, Traits, Moves -->
        <div class="col-span-3 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- Aces up the Sleeve -->
          <div class="section">
            <div class="text-center mb-3">
              <h2 class="text-xl font-serif text-[#5a4a3a] italic mb-4">王牌在手</h2>
              <div class="aces-container flex items-start justify-center relative" style="height: 120px; padding-top: 10px;">
                <img 
                  v-for="(ace, index) in store.aces" 
                  :key="index"
                  :src="assetPath(`/assets/sheet/${ace.icon}${ace.active ? '-filled' : ''}.svg`)" 
                  class="ace-card cursor-pointer transition-all duration-300 hover:scale-110"
                  :class="{ 'opacity-100': ace.active, 'opacity-60': !ace.active }"
                  :style="getAceCardStyle(index)"
                  @click="store.toggleAce(index)"
                  :alt="`${ace.name} Ace`" 
                />
              </div>
            </div>
          </div>

          <!-- Traits -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              特質              
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <div class="space-y-2">
              <textarea v-for="(trait, index) in store.traits" :key="index" 
                        v-model="store.traits[index]"
                        class="w-full border border-[#8b7355] rounded px-3 py-2 text-sm bg-white resize-none" 
                        rows="4"></textarea>
            </div>
          </div>

          <!-- Moves -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              招式              
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <div class="space-y-2">
              <div v-for="(move, index) in store.moves" :key="index" class="border border-[#8b7355] rounded overflow-hidden bg-white relative">
                <div class="flex">
                  <!-- 使用狀態按鈕 -->
                  <button 
                    @click="store.toggleMoveUsed(index)"
                    class="w-8 flex-shrink-0 flex items-center justify-center transition-colors"
                    :class="move.used ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-600'"
                    :title="move.used ? '已使用' : '未使用'">
                  </button>
                  
                  <!-- 招式內容區 -->
                  <div class="flex-1 p-3 transition-colors" :class="move.used ? 'bg-gray-200' : 'bg-white'">
                    <textarea 
                      v-model="store.moves[index].text" 
                      class="w-full text-sm resize-none border-0 focus:outline-none mb-2 transition-colors" 
                      :class="move.used ? 'bg-gray-200 text-gray-600' : 'bg-transparent'"
                      rows="5"></textarea>
                    <div class="flex justify-end gap-2 border-t border-[#8b7355] pt-2">
                      <img 
                        :src="store.moves[index].suits.heart ? assetPath('/assets/sheet/heart-filled.svg') : assetPath('/assets/sheet/heart.svg')" 
                        class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
                        alt="Heart" 
                        @click="store.toggleMoveSuit(index, 'heart')" />
                      <img 
                        :src="store.moves[index].suits.diamond ? assetPath('/assets/sheet/diamond-filled.svg') : assetPath('/assets/sheet/diamond.svg')" 
                        class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
                        alt="Diamond" 
                        @click="store.toggleMoveSuit(index, 'diamond')" />
                      <img 
                        :src="store.moves[index].suits.club ? assetPath('/assets/sheet/club-filled.svg') : assetPath('/assets/sheet/club.svg')" 
                        class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
                        alt="Club" 
                        @click="store.toggleMoveSuit(index, 'club')" />
                      <img 
                        :src="store.moves[index].suits.spade ? assetPath('/assets/sheet/spade-filled.svg') : assetPath('/assets/sheet/spade.svg')" 
                        class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
                        alt="Spade" 
                        @click="store.toggleMoveSuit(index, 'spade')" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三栏 - Decorum, Stress, Conditions -->
        <div class="col-span-3 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- Decorum -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              儀態
            </div>
            <div class="flex justify-center gap-2 mb-4">
              <div v-for="(level, index) in decorumLevels" :key="index" class="decorum-tooltip-container pl-5">
                <img :src="store.currentDecorum === index + 1 ? assetPath('/assets/sheet/butterfly-filled.svg') : assetPath('/assets/sheet/butterfly.svg')" 
                     class="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" 
                     @click="store.setDecorum(index + 1)" />
                     {{ level.name_cn }}
                <div class="decorum-tooltip">
                  <div class="text-xs">{{ level.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stress -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              壓力
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <div class="flex justify-center gap-1 mb-2">
              <img v-for="i in 12" :key="i"
                   :src="getStressIcon(i)"
                   class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                   :alt="`Stress ${i}`"
                   @click="store.setStressLevel(i)" />
            </div>
          </div>

          <!-- Conditions -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              狀態
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div v-for="condition in store.conditions" :key="condition.name_en" class="flex items-center justify-between">
                <div class="condition-tooltip-container flex items-center gap-2 cursor-help">
                  <span class="text-[#5a4a3a] uppercase text-x">{{ condition.name_cn }}</span>
                  <div class="condition-tooltip">
                    <div class="text-xs whitespace-pre-line">{{ condition.description }}</div>
                  </div>
                </div>
                <img 
                  :src="getConditionIcon(condition)"
                  class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                  :alt="condition.name_en"
                  @click="store.toggleCondition(condition)" />
              </div>
            </div>
          </div>

          <!-- Contracts -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              契約
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <textarea v-model="store.contracts" class="w-full border border-[#8b7355] rounded px-3 py-1 text-sm bg-white resize-none" 
                      rows="19"></textarea>
          </div>

          <!-- TTT -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              驚世駭人之事
            </div>            
            <div class="flex justify-center items-center gap-2 mb-2">
              <img 
                v-for="i in 5" 
                :key="i"
                :src="store.currentTTT === i ? assetPath(`/assets/sheet/ttt${i}-filled.svg`) : assetPath(`/assets/sheet/ttt${i}-filled-white.svg`)"
                class="h-8 cursor-pointer hover:scale-110 transition-transform"
                :alt="`TTT ${i}`"
                @click="store.setTTT(i)" />
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <textarea 
              v-model="store.tttNotes"
              class="w-full border border-[#8b7355] rounded px-3 py-2 text-sm bg-white resize-none" 
              rows="14"
              placeholder="記錄..."></textarea>
          </div>
        </div>

        <!-- 第四栏 - Character Info, Memories, Experiences -->
        <div class="col-span-3 p-4 space-y-6">

          <!-- Character Info Card -->
          <div class="character-info relative bg-gradient-to-b from-[#8b7ba8] to-[#6b5b88] rounded-lg p-4 text-white">
            <div class="space-y-2">
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">姓名</label>
                <input type="text" v-model="store.characterInfo.name" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">家園</label>
                <input type="text" v-model="store.characterInfo.homeland" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">職業</label>
                <input type="text" v-model="store.characterInfo.profession" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">志業</label>
                <input type="text" v-model="store.characterInfo.vocation" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">語言</label>
                <input type="text" v-model="store.characterInfo.languages" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>

          <!-- Memories -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              回憶
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <div class="border border-[#8b7355] rounded-b p-3 bg-white space-y-1">
              <div v-for="(memory, index) in store.memories" :key="index" class="flex items-center gap-2">
                <span class="text-xs text-[#8b7355]">{{ ['I', 'II', 'III', 'IV','', 'V', ''][index] }}</span>
                <input type="text" v-model="store.memories[index]" class="flex-1 border-b border-[#8b7355] px-1 py-0.5 text-xs bg-transparent" />
              </div>
            </div>
          </div>

          <!-- Experiences -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              經歷
            </div>
            <img :src="assetPath('/assets/sheet/deco1.svg')" class="pb-2"/>
            <textarea v-model="store.experiences" class="w-full border border-[#8b7355] rounded px-3 py-3 text-sm bg-white resize-none" 
                      rows="28"></textarea>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center py-2 border-t border-[#8b7355] bg-[#f9f6f0]">
        <p class="text-xs text-[#b8956a] italic">The classic Character Sheet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
import { onMounted, watch } from 'vue'

const store = useCharacterStore()
const fileInput = ref<HTMLInputElement | null>(null)
const assetPath = useAssetPath
const equipmentEditMode = ref(false)

// 武器特性說明
const weaponTraits = {
  '精準': '在長距離射擊時不承受任何劣勢。',
  '雙管': '在重新裝填前可射擊兩次。相關背景見第八節〈史詩〉中的歷史事件。',
  '決鬥': '允許你使用部分決鬥者招式。',
  '火器': '允許你射擊。極度吵雜。每次射擊後必須重新裝填。',
  '沉重': '有助於破壞物品、牆面與門扉。',
  '非法': '持有或使用時，可能引發法律上的麻煩。',
  '尖銳': '有助於刺穿堅硬表面，亦可作為槓桿使用。',
  '遠程': '允許你射擊。每次射擊後必須重新裝填。',
  '觸及': '允許你在短距離外進行攻擊。',
  '鋒利': '有助於切斷繩索、霉菌、蘑菇或其他障礙物。',
  '小型': '易於藏匿。',
  '投擲': '可在短距離內投擲作為攻擊。',
  '雙手': '需要雙手才能正確使用；在狹窄空間中會受到阻礙。',
  '寬幅': '使你獲得部分掩蔽的效果，對抗遠程攻擊的反應骰 +1，但行動時承受 −1。'
}

// 解析裝備文字
const parsedEquipment = computed(() => {
  if (!store.equipmentText) return []
  
  const items: Array<{ name: string, traits: string[], fullText: string }> = []
  const lines = store.equipmentText.split('\n')
  let currentItem: { name: string, traits: string[], fullText: string } | null = null
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    
    // 檢查是否為新物品（包含｜或價格）
    if (trimmedLine.includes('｜') || trimmedLine.includes('價格')) {
      // 保存前一個物品
      if (currentItem) {
        items.push(currentItem)
      }
      
      // 解析名稱
      const namePart = trimmedLine.split('｜')[0].trim()
      currentItem = {
        name: namePart,
        traits: [],
        fullText: trimmedLine
      }
    } else if (currentItem && (trimmedLine.startsWith('特性：') || trimmedLine.startsWith('特性:'))) {
      // 解析特性
      const traitsText = trimmedLine.replace(/^特性[：:]/g, '').trim()
      if (traitsText && traitsText !== '—') {
        currentItem.traits = traitsText.split(/[、,，]/).map(t => t.trim()).filter(t => t)
      }
      currentItem.fullText += '\n' + trimmedLine
    } else if (currentItem) {
      currentItem.fullText += '\n' + trimmedLine
    }
  }
  
  // 保存最後一個物品
  if (currentItem) {
    items.push(currentItem)
  }
  
  return items
})

// 獲取武器特性說明
const getWeaponTraitDescription = (trait: string): string => {
  return weaponTraits[trait as keyof typeof weaponTraits] || '無說明'
}

// 複製到剪貼板
const toast = useToast()
const copyToClipboard = async (item: { name: string, traits: string[], fullText: string }) => {
  try {
    // 組合完整內容：原始文本 + 特性說明
    let textToCopy = item.fullText
    
    if (item.traits.length > 0) {
      textToCopy += '\n\n【特性說明】\n'
      item.traits.forEach(trait => {
        const description = getWeaponTraitDescription(trait)
        textToCopy += `${trait}：${description}\n`
      })
    }
    
    await navigator.clipboard.writeText(textToCopy)
    toast.add({
      title: '已複製到剪貼板',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (err) {
    console.error('複製失敗:', err)
    toast.add({
      title: '複製失敗',
      description: '請稍後再試',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  }
}
// 客戶端掛載後載入持久化資料
onMounted(() => {
  store.loadFromLocalStorage()
})

// 監聽所有直接綁定的響應式屬性，自動保存
watch(() => [
  store.wealthLevel,
  store.coins,
  store.equipmentText,
  store.traits,
  store.contracts,
  store.tttNotes,
  store.experiences,
  store.memories,
  store.characterInfo
], () => {
  store.saveToLocalStorage()
}, { deep: true })

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${assetPath('/assets/sheet/sheet_bg.webp')})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const getAceCardStyle = (index: number) => {
  const totalCards = 5
  const rotationStep = 12
  const middleIndex = (totalCards - 1) / 2
  const rotation = (index - middleIndex) * rotationStep
  const verticalOffset = Math.abs(index - middleIndex) * 8
  
  return {
    transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
    transformOrigin: 'center top',
    position: 'absolute',
    left: `${35 + index * 55}px`
  }
}

const toggleCategoryLevel = (categoryId: string, clickedIndex: number) => {
  store.toggleCategoryLevel(categoryId, clickedIndex)
}

const toggleSkillLevel = (categoryId: string, skillName: string, clickedIndex: number) => {
  store.toggleSkillLevel(categoryId, skillName, clickedIndex)
}

const skillCategories = computed(() => [
  {
    id: 'society',
    title: '社交',
    icon: 'heart',
    level: store.categoryLevels.society,
    backgroundImage: assetPath('/assets/dice/face_3_alpha.png'),
    skills: store.societySkills
  },
  {
    id: 'academia',
    title: '學識',
    icon: 'diamond',
    level: store.categoryLevels.academia,
    backgroundImage: assetPath('/assets/dice/face_4_alpha.png'),
    skills: store.academiaSkills
  },
  {
    id: 'war',
    title: '戰事',
    icon: 'club',
    level: store.categoryLevels.war,
    backgroundImage: assetPath('/assets/dice/face_5_alpha.png'),
    skills: store.warSkills
  },
  {
    id: 'street',
    title: '街巷',
    icon: 'spade',
    level: store.categoryLevels.street,
    backgroundImage: assetPath('/assets/dice/face_6_alpha.png'),
    skills: store.streetSkills
  }
])

const decorumLevels = ref([
  { name_cn: '粗鄙', name_en: 'Uncouth', description: '骯髒、衣著不整，整體看起來聲名狼藉。' },
  { name_cn: '寒酸', name_en: 'Shabby', description: '穿著邋遢、像是地痞流氓的打扮。' },
  { name_cn: '樸素', name_en: 'Decent', description: '梳洗整齊，穿著適合大多數場合。' },
  { name_cn: '優雅', name_en: 'Elegant', description: '極度注重外表，身著精緻服裝。' },
  { name_cn: '浮誇', name_en: 'Pompous', description: '髮型走在時尚尖端、妝容齊全，衣著幾乎可稱為藝術品。' }
])

const getStressIcon = (index: number) => {
  const isFilled = index <= store.currentStress
  if (index === 8) {
    return isFilled ? assetPath('/assets/sheet/stress_special-filled.svg') : assetPath('/assets/sheet/stress_special.svg')
  } else {
    return isFilled ? assetPath('/assets/sheet/square-small.png') : assetPath('/assets/sheet/square-small-red.png')
  }
}

const getConditionIcon = (condition: any) => {
  if (['Embarrassed', 'Confused', 'Hurt', 'Scared'].includes(condition.name_en)) {
    return condition.checked 
      ? assetPath(`/assets/sheet/${condition.icon}-filled.svg`) 
      : assetPath(`/assets/sheet/${condition.icon}.svg`)
  } else {
    return condition.checked ? assetPath('/assets/sheet/square-small.png') : assetPath('/assets/sheet/square-small-red.png')
  }
}

const handleImport = () => {
  fileInput.value?.click()
}

const handleClearAll = () => {
  if (confirm('⚠️ 確定要清空所有資料嗎？此操作無法復原！')) {
    store.clearAll()
    alert('✅ 已清空所有資料')
  }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        const success = store.importData(jsonData)
        if (success) {
          alert('角色資料載入成功！')
        } else {
          alert('載入失敗，請檢查檔案格式')
        }
      } catch (error) {
        alert('載入失敗，無效的 JSON 檔案')
      }
    }
    reader.readAsText(file)
  }
  
  // 重置 input，允许重复选择相同文件
  if (target) target.value = ''
}
</script>

<style scoped>
.character-sheet-container {
  font-family: 'Georgia', serif;
}

.skill-section h2 {
  font-family: 'Cinzel', serif;
}

input[type="text"],
textarea {
  font-family: 'Courier New', monospace;
}

input[type="checkbox"],
input[type="radio"] {
  cursor: pointer;
}

.character-info {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Aces Cards */
.aces-container {
  position: relative;
  min-width: 350px;
}

.ace-card {
  width: 70px;
  height: 100px;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}

.ace-card:hover {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.3));
}

/* Decorum Tooltip */
.decorum-tooltip-container {
  position: relative;
  display: inline-block;
}

.decorum-tooltip {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(90, 74, 58, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
  margin-right: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  white-space: normal;
}

.decorum-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(90, 74, 58, 0.95);
}

.decorum-tooltip-container:hover .decorum-tooltip {
  opacity: 1;
}

/* Skill Tooltip */
.skill-tooltip-container {
  position: relative;
  display: inline-block;
}

.skill-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(90, 74, 58, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 20;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  max-width: 350px;
  white-space: normal;
}

.skill-tooltip::after {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgba(90, 74, 58, 0.95);
}

.skill-tooltip-container:hover .skill-tooltip {
  opacity: 1;
}

/* Condition Tooltip */
.condition-tooltip-container {
  position: relative;
  display: inline-block;
}

.condition-tooltip {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(90, 74, 58, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 20;
  margin-right: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 280px;
  max-width: 400px;
  white-space: normal;
}

.condition-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(90, 74, 58, 0.95);
}

.condition-tooltip-container:hover .condition-tooltip {
  opacity: 1;
}

/* Weapon Trait Tooltip */
.weapon-trait-container {
  position: relative;
  display: inline-block;
}

.weapon-trait-tooltip {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(90, 74, 58, 0.95);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  max-width: 280px;
  white-space: normal;
  text-align: left;
}

.weapon-trait-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(90, 74, 58, 0.95);
}

.weapon-trait-container:hover .weapon-trait-tooltip {
  opacity: 1;
}

/* Equipment Textarea - 每行自动显示分隔线效果 */
.equipment-textarea {
  background-image: repeating-linear-gradient(
    transparent,
    transparent 1.5em,
    #8b7355 1.5em,
    #8b7355 calc(1.5em + 1px)
  );
  background-attachment: local;
  line-height: 1.5em;
}
</style>
