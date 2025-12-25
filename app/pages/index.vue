<template>
  <div class="character-sheet-container min-h-screen p-8" :style="backgroundStyle">
    <div class="character-sheet max-w-[1200px] mx-auto bg-[#f5f0e8] shadow-2xl rounded-lg overflow-hidden">
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
              backgroundSize: 'auto 110%',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat'
            }">
            <div class="flex items-center gap-2 mb-3 relative z-10 pl-7">
              <h2 class="text-lg font-serif text-[#5a4a3a]">{{ category.title }}</h2>
              <img v-for="i in 2" :key="i" 
                   :src="i <= category.level ? `/assets/sheet/${category.icon}-filled.svg` : `/assets/sheet/${category.icon}.svg`" 
                   class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" 
                   :alt="category.icon" 
                   @click="toggleCategoryLevel(category.id, i)" />
            </div>
            <div v-for="skill in category.skills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <div class="skill-tooltip-container relative">
                <span class="text-[#5a4a3a] uppercase text-x cursor-help pl-20">{{ skill.name_cn }}</span>
                <div class="skill-tooltip">
                  <div class="text-xs">{{ skill.description }}</div>
                </div>
              </div>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? `/assets/sheet/${category.icon}-filled.svg` : `/assets/sheet/${category.icon}.svg`" 
                     class="w-3 h-3 cursor-pointer hover:scale-110 transition-transform" 
                     alt="Level" 
                     @click="toggleSkillLevel(category.id, skill.name, i)" />
              </div>
            </div>
          </div>

          <!-- Equipment & Wealth -->
          <div class="skill-section">
            <h2 class="text-base font-serif text-[#5a4a3a] mb-3 border-b border-[#8b7355] pb-2">裝備 & 財富</h2>
            <div class="grid grid-cols-2 gap-2 mb-2">
              <input type="text" class="col-span-2 border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
              <input type="text" class="border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
              <input type="text" class="border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
            </div>
            <div class="flex items-center gap-2 text-xs mt-2">
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="poor" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">貧困</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="middle" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">中產階級</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="well-off" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">小康</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="rich" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">富有</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 中間欄 - Aces, Traits, Moves -->
        <div class="col-span-5 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- Aces up the Sleeve -->
          <div class="section">
            <div class="text-center mb-3">
              <h2 class="text-xl font-serif text-[#5a4a3a] italic mb-4">王牌在手</h2>
              <div class="flex items-center justify-center gap-3">
                <img 
                  v-for="(ace, index) in aces" 
                  :key="index"
                  :src="`/assets/sheet/${ace.icon}${ace.active ? '-filled' : ''}.svg`" 
                  class="ace-card cursor-pointer transition-all duration-300 hover:scale-110"
                  :class="{ 'opacity-100': ace.active, 'opacity-60': !ace.active }"
                  @click="toggleAce(index)"
                  :alt="`${ace.name} Ace`" 
                />
              </div>
            </div>
          </div>

          <!-- Traits -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-2 border-b border-[#8b7355] pb-2">
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1" alt="Decoration" />
              Traits
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1" alt="Decoration" />
            </h2>
            <div class="space-y-2">
              <textarea v-for="i in 5" :key="i" 
                        class="w-full border border-[#8b7355] rounded px-3 py-2 text-sm bg-white resize-none" 
                        rows="2"></textarea>
            </div>
          </div>

          <!-- Moves -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-2 border-b border-[#8b7355] pb-2">
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1" alt="Decoration" />
              Moves
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1" alt="Decoration" />
            </h2>
            <div class="space-y-2">
              <div v-for="i in 3" :key="i" class="border border-[#8b7355] rounded p-3 bg-white relative">
                <textarea class="w-full text-sm bg-transparent resize-none border-0 focus:outline-none mb-2" 
                          rows="3"></textarea>
                <div class="flex justify-end gap-2 border-t border-[#8b7355] pt-2">
                  <img src="/assets/sheet/heart.svg" class="w-4 h-4" alt="Heart" />
                  <img src="/assets/sheet/diamond.svg" class="w-4 h-4" alt="Diamond" />
                  <img src="/assets/sheet/club.svg" class="w-4 h-4" alt="Club" />
                  <img src="/assets/sheet/spade.svg" class="w-4 h-4" alt="Spade" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側欄 - Decorum, Conditions, Contracts, Character Info -->
        <div class="col-span-4 p-4 space-y-6">
          
          <!-- Decorum -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-3">儀態</h2>
            <div class="flex justify-center gap-2 mb-4">
              <div v-for="(level, index) in decorumLevels" :key="index" class="decorum-tooltip-container pl-5">
                <img :src="currentDecorum === index + 1 ? '/assets/sheet/butterfly-filled.svg' : '/assets/sheet/butterfly.svg'" 
                     class="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" 
                     :alt="level.name_cn"
                     @click="setDecorum(index + 1)" />
                     {{ level.name_cn }}
                <div class="decorum-tooltip">
                  <div class="text-xs">{{ level.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stress -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-3">Stress</h2>
            <div class="grid grid-cols-11 gap-1 mb-2">
              <div v-for="i in 11" :key="i" 
                   class="w-4 h-4 border border-[#8b7355] bg-white"></div>
            </div>
          </div>

          <!-- Conditions -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-3">Conditions</h2>
            <div class="space-y-2 text-sm">
              <div v-for="condition in conditions" :key="condition.name" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[#5a4a3a] uppercase text-xs">{{ condition.name }}</span>
                  <img src="/assets/sheet/heart.svg" class="w-4 h-4" alt="Icon" />
                </div>
                <input type="checkbox" class="w-4 h-4" />
              </div>
            </div>
          </div>

          <!-- Contracts -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-2">Contracts</h2>
            <textarea class="w-full border border-[#8b7355] rounded px-3 py-2 text-sm bg-white resize-none" 
                      rows="4"></textarea>
          </div>

          <!-- Character Info Card -->
          <div class="character-info relative bg-gradient-to-b from-[#8b7ba8] to-[#6b5b88] rounded-lg p-4 text-white">
            <div class="text-center mb-3">
              <div class="relative inline-block">
                <img src="/assets/sheet/profile-img-frame.png" class="w-24 h-24 mx-auto" alt="Frame" />
              </div>
            </div>
            <div class="space-y-2">
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">Name</label>
                <input type="text" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">Homeland</label>
                <input type="text" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">Profession</label>
                <input type="text" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">Vocation</label>
                <input type="text" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-wide opacity-80">Languages</label>
                <input type="text" class="w-full bg-white/20 border border-white/30 rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>

          <!-- Memories -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-2 bg-gradient-to-b from-[#8b7ba8] to-[#6b5b88] text-white py-2 rounded-t">
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1 brightness-0 invert" alt="Decoration" />
              Memories
              <img src="/assets/sheet/deco1.svg" class="inline w-16 mb-1 brightness-0 invert" alt="Decoration" />
            </h2>
            <div class="border border-[#8b7355] rounded-b p-3 bg-white space-y-1">
              <div v-for="i in 5" :key="i" class="flex items-center gap-2">
                <span class="text-xs text-[#8b7355]">{{ ['I', 'II', 'III', 'IV', 'V'][i-1] }}</span>
                <input type="text" class="flex-1 border-b border-[#8b7355] px-1 py-0.5 text-xs bg-transparent" />
              </div>
            </div>
          </div>

          <!-- Experiences -->
          <div class="section">
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-2">Experiences</h2>
            <textarea class="w-full border border-[#8b7355] rounded px-3 py-2 text-sm bg-white resize-none" 
                      rows="4"></textarea>
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
const backgroundStyle = computed(() => ({
  backgroundImage: 'url(/assets/sheet/sheet_bg.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

// Aces state
const aces = ref([
  { name: 'Hearts', icon: 'ace-hearts', active: false },
  { name: 'Diamonds', icon: 'ace-diamonds', active: false },
  { name: 'Clubs', icon: 'ace-clubs', active: false },
  { name: 'Spades', icon: 'ace-spades', active: false },
  { name: 'Joker', icon: 'ace-joker', active: false }
])

const toggleAce = (index: number) => {
  aces.value[index].active = !aces.value[index].active
}

// 技能類別等級
const categoryLevels = ref({
  society: 1,
  academia: 1,
  war: 1,
  street: 1
})

// 切換技能类别等级 (1-2)
const toggleCategoryLevel = (categoryId: string, clickedIndex: number) => {
  const currentLevel = categoryLevels.value[categoryId]
  // 如果点击的是当前最后一个填充的，则回到 level 1
  if (clickedIndex === currentLevel) {
    categoryLevels.value[categoryId] = 1
  } else {
    // 否则设置为点击的索引
    categoryLevels.value[categoryId] = clickedIndex
  }
}

// 切換技能等级 (1-4)
const toggleSkillLevel = (categoryId: string, skillName: string, clickedIndex: number) => {
  const targetSkills = 
    categoryId === 'society' ? societySkills :
    categoryId === 'academia' ? academiaSkills :
    categoryId === 'war' ? warSkills :
    streetSkills
  
  const skill = targetSkills.value.find(s => s.name === skillName)
  if (skill) {
    // 如果点击的是当前最后一个填充的，则回到 level 1
    if (clickedIndex === skill.level) {
      skill.level = 1
    } else {
      // 否则设置为点击的索引
      skill.level = clickedIndex
    }
  }
}

const societySkills = ref([
  { name: 'ART',  name_cn: '藝術',  level: 1, description: '當你在舞蹈、音樂會或戲劇演出中表演，意圖迷住他人、證明自身技藝，或分散大眾注意力時，使用藝術。你也可以使用藝術來創作、辨識或評價任何形式的藝術品，或展現你對藝術的淵博知識。' },
  { name: 'CHARM',  name_cn: '魅力', level: 1, description: '當你試圖展現引人注目、討喜、優雅或整潔的形象時，使用魅力。魅力能讓你勾引小小族，或給人留下良好印象。你的魅力並不代表外貌上的美麗；而是你如何運用自身條件，贏得他人好感的能力。' },
  { name: 'ELOQUENCE',  name_cn: '口才', level: 1, description: '當你以三寸不爛之舌動搖、說服、議價或欺騙他人時，使用口才。你也可以用它在群眾面前發言，或對大型聽眾演說。只要口才足夠高明，你甚至能改變一名小小族的觀點，在不訴諸暴力的情況下化解局勢。' },
  { name: 'ETIQUETTE',   name_cn: '禮儀',level: 1, description: '當你展現完美無缺的禮節時，使用禮儀。無論是深深鞠躬、行出完美的屈膝禮、選對餐叉、贈送得體的禮物，與拘謹或高貴的小小族互動，或依循另一族群的傳統行事，在所有這些情況下，你都可以依靠禮儀。' },
  { name: 'GRACE',  name_cn: '身姿', level: 1, description: '使用身姿來流暢地移動、維持良好儀態，或在極為高雅的情境中舞蹈。身姿能幫助你保持平衡、完成雜技般的動作，或做出需要極高精準度的行為。此外，若你是仙靈族，則使用身姿來靈巧而精確地飛行。' }
])

const academiaSkills = ref([
  { name: 'CARE',name_cn: '照護', level: 1, description: '使用照護來移除「受傷」或「崩潰」狀態、施行醫療照護，或診斷與治療任何疾病。你也可以透過照護提供情緒或心理上的支持，照顧他人，或幫助一名小小族度過艱難時期。' },
  { name: 'CRAFT',name_cn: '工匠', level: 1, description: '使用工匠來打造、修理並使用科技物品與裝置。你也可以將工匠用於各類手工技藝、製作陷阱與臨時結構，或執行小型修繕與維護工作。此外，工匠亦可用於烹調健康且均衡的餐點，並藉此移除「疲勞」狀態。' },
  { name: 'CULTURE',name_cn: '文化', level: 1, description: '使用文化來回想你在學習過程或親身經驗中獲得的資訊。你也可以用它來翻譯手稿，或嘗試理解並說出你不熟悉的語言。你的文化代表你的受教育程度，以及你對自身文化與家宅其他文化之習俗、慣例與傳統的理解。' },
  { name: 'INSIGHT',name_cn: '洞悉', level: 1, description: '使用洞悉來分析你所處的情境、周遭環境，以及你身邊的小小族。透過洞悉，你能識破謊言與詐騙。你也可以用它來解開謎語與謎題，或在絕境中找出解決方案。' },
  { name: 'INVESTIGATION', name_cn: '調查',level: 1, description: '使用調查來尋找或評估證據與隱藏物品，或蒐集資訊。你也可以藉由調查分析犯罪現場以搜尋線索，或注意到那些極易被忽略的細微細節。此外，當你面對一名對手時，可以使用調查來得知其弱點。' }
])

const warSkills = ref([
  { name: 'ATHLETICS', name_cn: '運動',level: 1, description: '使用運動來奔跑、跳躍、攀爬或游泳。你也可以將運動用於任何需要高度敏捷與體能的身體壯舉、衝刺，或試圖化解一次災難性的墜落。當你全速騎乘在老鼠、甲蟲或蝸牛背上時，同樣是在使用運動技能。' },
  { name: 'AUTHORITY', name_cn: '權威',level: 1, description: '使用權威來領導、下達清楚而果斷的命令，並讓他人在絕境中仍願意追隨你。透過權威，你也能激勵並重新點燃勇氣、威嚇他人、勒索情報，甚至馴服家養或野生動物。' },
  { name: 'FIGHT', name_cn: '武術',level: 1, description: '使用武術直接攻擊你的對手，或防禦其猛烈攻勢。透過武術，你可以徒手鬥毆、壓制、抓住或制伏他人。此外，你也能使用任何形式的近戰或決鬥武器。' },
  { name: 'STRENGTH',name_cn: '力量', level: 1, description: '使用力量來推、拉、舉起、破壞或搬運物體。你也可以將力量用於任何需要蠻力的身體行動，例如踢倒門扉或路障，或承受長時間且劇烈的勞動。當你狂飲暴食、撐到極限，只為展示你鋼鐵般的胃袋時，你使用的正是力量技能。' },
  { name: 'WILL', name_cn: '意志',level: 1, description: '使用意志來展現你的勇氣與臨危不亂的心智。透過意志，你能在危險或絕望的情境中抵抗恐懼，或在艱難時刻承受痛楚與緊張。此外，你也可以用它來保持清醒與警覺。' }
])

const streetSkills = ref([
  { name: 'CAUTION', name_cn: '警覺', level: 1, description: '使用警覺來保持高度戒備，並避開或繞過陷阱、危險或敵人。透過警覺，你也能預先察覺伏擊、發現隱藏的小小族或動物、注意到自己正被尾隨，或以謹慎而低調的方式行動。' },
  { name: 'DEXTERITY', name_cn: '敏捷', level: 1, description: '使用敏捷來完成需要極高精準度、靈活性或手上把戲的行動。透過敏捷，你可以扒竊或開鎖、使用釘尖或決鬥劍等輕型武器、掙脫束縛，或施展細微的障眼小戲法。' },
  { name: 'ELUSION', name_cn: '迴避', level: 1, description: '使用迴避來藏身、跟蹤、甩掉跟蹤者，或無聲而隱密地移動。此外，你也可以用它來閃避拋射物或投擲武器。依你所處的領域不同，迴避亦可用來拖延時間，或脫離險境。' },
  { name: 'EXPLORATION', name_cn: '探索', level: 1, description: '使用探索在荒野中辨識方向，並穿越無人地帶。透過探索，你也能在惡劣環境中求生、遠離聚落時尋找食物與資源，或找到一處可避開昆蟲的臨時藏身處。你也可以使用探索來與自然環境互動，並辨識動物或植物。' },
  { name: 'SHOOT', name_cn: '射術', level: 1, description: '使用射術來操作火器或遠程武器，或投擲各類武器。透過射術，你也可以將小物件擲向目標，或拋給你的同伴。' }
])

// 技能類別配置
const skillCategories = computed(() => [
  {
    id: 'society',
    title: '社交',
    icon: 'heart',
    level: categoryLevels.value.society,
    backgroundImage: '/assets/dice/face_3_alpha.png',
    skills: societySkills.value
  },
  {
    id: 'academia',
    title: '學識',
    icon: 'diamond',
    level: categoryLevels.value.academia,
    backgroundImage: '/assets/dice/face_4_alpha.png',
    skills: academiaSkills.value
  },
  {
    id: 'war',
    title: '戰事',
    icon: 'club',
    level: categoryLevels.value.war,
    backgroundImage: '/assets/dice/face_5_alpha.png',
    skills: warSkills.value
  },
  {
    id: 'street',
    title: '街巷',
    icon: 'spade',
    level: categoryLevels.value.street,
    backgroundImage: '/assets/dice/face_6_alpha.png',
    skills: streetSkills.value
  }
])

const conditions = ref([
  { name: 'EMBARRASSED', icon: 'heart' },
  { name: 'TIRED', icon: 'heart' },
  { name: 'CONFUSED', icon: 'diamond' },
  { name: 'SICK', icon: 'diamond' },
  { name: 'HURT', icon: 'club' },
  { name: 'POISONED', icon: 'club' },
  { name: 'FRIGHTENED', icon: 'spade' },
  { name: 'BROKEN', icon: 'spade' }
])

const decorumLevels = ref([
  { name_cn: '粗鄙', name_en: 'Uncouth', description: '骯髒、衣著不整，整體看起來聲名狼藉。' },
  { name_cn: '寒酸', name_en: 'Shabby', description: '穿著邋遢、像是地痞流氓的打扮。' },
  { name_cn: '樸素', name_en: 'Decent', description: '梳洗整齊，穿著適合大多數場合。' },
  { name_cn: '優雅', name_en: 'Elegant', description: '極度注重外表，身著精緻服裝。' },
  { name_cn: '浮誇', name_en: 'Pompous', description: '髮型走在時尚尖端、妝容齊全，衣著幾乎可稱為藝術品。' }
])

// 當前 Decorum 等級 (1-5)
const currentDecorum = ref(3) // 默認為「樸素」

const setDecorum = (level: number) => {
  currentDecorum.value = level
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
.ace-card {
  width: 70px;
  height: 100px;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
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
  min-width: 250px;
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
</style>
