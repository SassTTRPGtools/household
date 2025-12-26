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
            <div class="flex items-center gap-2 relative z-10 pl-7">
              <h2 class="text-xl text-[#5a4a3a]">{{ category.title }}</h2>
              <img v-for="i in 2" :key="i" 
                   :src="i <= category.level ? assetPath(`/assets/sheet/${category.icon}-filled.svg`) : assetPath(`/assets/sheet/${category.icon}.svg`)" 
                   class="w-6 cursor-pointer hover:scale-110 transition-transform" 
                   :alt="category.icon" 
                   @click="toggleCategoryLevel(category.id, i)" />
            </div>
            <img :src="assetPath('/assets/sheet/deco2.svg')" class="pb-2"/>
            <div v-for="skill in category.skills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <div class="skill-tooltip-container relative">
                <span class="text-[#5a4a3a] uppercase text-lg cursor-help pl-40">{{ skill.name_cn }}</span>
                <div class="skill-tooltip">
                  <div class="text-xs">{{ skill.description }}</div>
                </div>
              </div>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? assetPath(`/assets/sheet/${category.icon}-filled.svg`) : assetPath(`/assets/sheet/${category.icon}.svg`)" 
                     class="w-4 cursor-pointer hover:scale-110 transition-transform" 
                     alt="Level" 
                     @click="toggleSkillLevel(category.id, skill.name, i)" />
              </div>
            </div>
          </div>

          <!-- Equipment & Wealth -->
          <div class="skill-section border border-[#8b7355] rounded overflow-hidden">
            <!-- 标题栏 -->
            <div class="bg-[#f9f6f0] border-b border-[#8b7355] px-3 py-2 flex items-center justify-between">
              <h2 class="text-base font-serif text-[#5a4a3a]">裝備 & 財富</h2>
              <div class="flex items-center gap-3">
                <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
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
                    <span class="text-[#5a4a3a]">中產階級</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="wealth" value="rich" v-model="store.wealthLevel" class="w-3 h-3" />
                    <span class="text-[#5a4a3a]">富有</span>
                  </label>
                </div>
                硬幣
                <input type="number" min="0" v-model="store.coins" class="w-12 h-8 rounded-full border-2 border-[#8b7355] bg-white text-center text-xs focus:outline-none focus:ring-1 focus:ring-[#8b7355]" placeholder="0" />
              </div>
            </div>
            
            <!-- 内容区域 -->
            <div class="bg-[#e8e3db] p-2">
              <textarea 
                v-model="store.equipmentText"
                class="w-full bg-transparent text-xs px-2 py-1 focus:outline-none resize-none font-mono leading-relaxed equipment-textarea" 
                rows="15"
                placeholder="輸入裝備，每行一項..."></textarea>
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
              <div v-for="(move, index) in store.moves" :key="index" class="border border-[#8b7355] rounded p-3 bg-white relative">
                <textarea v-model="store.moves[index].text" class="w-full text-sm bg-transparent resize-none border-0 focus:outline-none mb-2" 
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

        <!-- 第三栏 - Decorum, Stress, Conditions -->
        <div class="col-span-3 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- Decorum -->
          <div class="section">
            <div class="text-xl font-serif text-[#5a4a3a] text-center mb-2">
              儀態
            </div>
            <div class="flex justify-center gap-2 mb-4">
              <div v-for="(level, index) in decorumLevels" :key="index" class="decorum-tooltip-container pl-5">
                <img :src="store.currentDecorum === index + 1 ? '/assets/sheet/butterfly-filled.svg' : '/assets/sheet/butterfly.svg'" 
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
  right: 20%;
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
  min-width: 200px;
  max-width: 350px;
  white-space: normal;
}

.skill-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(90, 74, 58, 0.95);
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
