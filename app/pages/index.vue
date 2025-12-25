<template>
  <div class="character-sheet-container min-h-screen p-8" :style="backgroundStyle">
    <div class="character-sheet max-w-[1200px] mx-auto bg-[#f5f0e8] shadow-2xl rounded-lg overflow-hidden">
      <!-- 主要內容區域 -->
      <div class="grid grid-cols-12 gap-0">
        
        <!-- 左側欄 - Society, Academia, War, Street -->
        <div class="col-span-3 border-r border-[#8b7355] p-4 space-y-6">
          
          <!-- Society 區塊 -->
          <div class="skill-section relative" style="background-image: url('/assets/dice/face_3_alpha.png'); background-size: auto 110%; background-position: left center; background-repeat: no-repeat;">
            <div class="flex items-center gap-2 mb-3 relative z-10 pl-7">
              <h2 class="text-lg font-serif text-[#5a4a3a]">社交</h2>
              <img src="/assets/sheet/heart.svg" class="w-4 h-4" alt="Heart" />
              <img src="/assets/sheet/heart.svg" class="w-4 h-4 opacity-30" alt="Heart Empty" />
            </div>
            <div v-for="skill in societySkills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <span class="text-[#5a4a3a] uppercase text-x font-medium justify-end pl-20">{{ skill.name_cn }}</span>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? '/assets/sheet/heart-filled.svg' : '/assets/sheet/heart.svg'" 
                     class="w-3 h-3" alt="Level" />
              </div>
            </div>
          </div>

          <!-- Academia 區塊 -->
          <div class="skill-section relative" style="background-image: url('/assets/dice/face_4_alpha.png'); background-size: auto 110%; background-position: left center; background-repeat: no-repeat;">
            <div class="flex items-center gap-2 mb-3 relative z-10 pl-7">
              <h2 class="text-lg font-serif text-[#5a4a3a]">學識</h2>
              <img src="/assets/sheet/diamond.svg" class="w-4 h-4" alt="Diamond" />
              <img src="/assets/sheet/diamond.svg" class="w-4 h-4 opacity-30" alt="Diamond Empty" />
            </div>
            <div v-for="skill in academiaSkills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <span class="text-[#5a4a3a] uppercase text-x font-medium justify-end pl-20">{{ skill.name_cn }}</span>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? '/assets/sheet/diamond-filled.svg' : '/assets/sheet/diamond.svg'" 
                     class="w-3 h-3" alt="Level" />
              </div>
            </div>
          </div>

          <!-- War 區塊 -->
          <div class="skill-section relative" style="background-image: url('/assets/dice/face_5_alpha.png'); background-size: auto 110%; background-position: left center; background-repeat: no-repeat;">
            <div class="flex items-center gap-2 mb-3 relative z-10 pl-7">
              <h2 class="text-lg font-serif text-[#5a4a3a]">戰事</h2>
              <img src="/assets/sheet/club.svg" class="w-4 h-4" alt="Club" />
              <img src="/assets/sheet/club.svg" class="w-4 h-4 opacity-30" alt="Club Empty" />
            </div>
            <div v-for="skill in warSkills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <span class="text-[#5a4a3a] uppercase text-x font-medium justify-end pl-20">{{ skill.name_cn }}</span>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? '/assets/sheet/club-filled.svg' : '/assets/sheet/club.svg'" 
                     class="w-3 h-3" alt="Level" />
              </div>
            </div>
          </div>

          <!-- Street 區塊 -->
          <div class="skill-section relative" style="background-image: url('/assets/dice/face_6_alpha.png'); background-size: auto 110%; background-position: left center; background-repeat: no-repeat;">
            <div class="flex items-center gap-2 mb-3 relative z-10 pl-7">
              <h2 class="text-lg font-serif text-[#5a4a3a]">街巷</h2>
              <img src="/assets/sheet/spade.svg" class="w-4 h-4" alt="Spade" />
              <img src="/assets/sheet/spade.svg" class="w-4 h-4 opacity-30" alt="Spade Empty" />
            </div>
            <div v-for="skill in streetSkills" :key="skill.name" class="flex items-center justify-between mb-1 text-sm relative z-10 pl-20">
              <span class="text-[#5a4a3a] uppercase text-x font-medium justify-end pl-20">{{ skill.name_cn }}</span>
              <div class="flex gap-1">
                <img v-for="i in 4" :key="i" 
                     :src="i <= skill.level ? '/assets/sheet/spade-filled.svg' : '/assets/sheet/spade.svg'" 
                     class="w-3 h-3" alt="Level" />
              </div>
            </div>
          </div>

          <!-- Equipment & Wealth -->
          <div class="skill-section">
            <h2 class="text-base font-serif text-[#5a4a3a] mb-3 border-b border-[#8b7355] pb-2">Equipment & Wealth</h2>
            <div class="grid grid-cols-2 gap-2 mb-2">
              <input type="text" class="col-span-2 border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
              <input type="text" class="border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
              <input type="text" class="border border-[#8b7355] rounded px-2 py-1 text-xs bg-white" />
            </div>
            <div class="flex items-center gap-2 text-xs mt-2">
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="poor" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">POOR</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="middle" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">MIDDLE CLASS</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="well-off" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">WELL-OFF</span>
              </label>
              <label class="flex items-center gap-1">
                <input type="radio" name="wealth" value="rich" class="w-3 h-3" />
                <span class="text-[#5a4a3a]">RICH</span>
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
            <h2 class="text-xl font-serif text-[#5a4a3a] text-center mb-3">Decorum</h2>
            <div class="flex justify-center gap-2 mb-4">
              <img v-for="i in 5" :key="i" 
                   src="/assets/sheet/butterfly.svg" 
                   class="w-6 h-6" alt="Butterfly" />
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

const societySkills = ref([
  { name: 'ART',  name_cn: '藝術',  level: 1 },
  { name: 'CHARM',  name_cn: '魅力', level: 1 },
  { name: 'ELOQUENCE',  name_cn: '口才', level: 1 },
  { name: 'ETIQUETTE',   name_cn: '禮儀',level: 1 },
  { name: 'GRACE',  name_cn: '身姿', level: 1 }
])

const academiaSkills = ref([
  { name: 'CARE',name_cn: '照護', level: 1 },
  { name: 'CRAFT',name_cn: '工匠', level: 1 },
  { name: 'CULTURE',name_cn: '文化', level: 1 },
  { name: 'INSIGHT',name_cn: '洞悉', level: 1 },
  { name: 'INVESTIGATION', name_cn: '調查',level: 1 }
])

const warSkills = ref([
  { name: 'ATHLETICS', name_cn: '運動',level: 1 },
  { name: 'AUTHORITY', name_cn: '權威',level: 1 },
  { name: 'FIGHT', name_cn: '武術',level: 1 },
  { name: 'STRENGTH',name_cn: '力量', level: 1 },
  { name: 'WILL', name_cn: '意志',level: 1 }
])

const streetSkills = ref([
  { name: 'CAUTION', name_cn: '警覺', level: 1},
  { name: 'DEXTERITY', name_cn: '巧手', level: 1 },
  { name: 'ELUSION', name_cn: '迴避', level: 1 },
  { name: 'EXPLORATION', name_cn: '探索', level: 1 },
  { name: 'SHOOT', name_cn: '射術', level: 1 }
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
</style>
