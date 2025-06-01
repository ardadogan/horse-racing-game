<template>
  <div class="col-lg-9">
    <div class="race-track" v-show="schedule.length">
      <div
        v-for="(horse, index) in currentRoundHorses"
        :key="horse.id"
        class="lane d-flex align-items-center"
      >
        <span class="lane-number">{{ index + 1 }}</span>
        <div
          class="horse"
          :style="{
            left: getHorsePosition(horse.id) + '%',
            transition: getHorseTransition(horse.id),
          }"
        >
          <LottieAnimation
            :animationData="animationData"
            :loop="isRunning ? true : false"
            :autoplay="true"
            :width="58"
            :height="58"
            style="transform: scaleX(-1)"
          />
          <span class="horse-info d-flex align-items-center">
            <span :style="{ backgroundColor: horse.color.toLowerCase() }" class="color-box"></span>
            {{ horse.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between py-2" v-if="currentRoundHorses.length">
      <span> {{ currentRound + 1 }}.Lap {{ schedule[currentRound]?.distance }}m</span>
      <span>FINISH</span>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

// At koşma animasyonu (Lottie dosyası)
import animationData from '@/assets/running-horse.json'

const store = useStore()

// Vuex'ten yarış programı (schedule) alınır
const schedule = computed(() => store.state.races.schedule)

// Şu an hangi turda olduğumuzu gösteren bilgi
const currentRound = computed(() => store.state.races.currentRound)

// Yarışın devam edip etmediği bilgisi
const isRunning = computed(() => store.state.races.isRunning)

// Şu anki turda yarışacak atlar listesi
const currentRoundHorses = computed(() => {
  if (!schedule.value.length || currentRound.value >= schedule.value.length) return []
  return schedule.value[currentRound.value].horses
})

// Her atın pozisyonunu ve transition durumunu tutan objeler
const positions = ref({}) // Atın piste göre soldan ne kadar ilerlediği (yüzde)
const transitions = ref({}) // Atın hareketinin animasyonlu olup olmadığı

// currentRound veya isRunning değiştiğinde çalışan izleyici
watch([currentRound, isRunning], ([round, running]) => {
  if (!running) return

  const roundHorses = schedule.value[round]?.horses || []

  // İlk başta transition kapatılır, bu başlangıç pozisyonuna ışınlama için
  roundHorses.forEach((h) => {
    transitions.value[h.id] = false
  })

  // Başlangıç pozisyonu biraz solda (3%) ayarlanır
  roundHorses.forEach((h) => {
    positions.value[h.id] = 3
  })

  // Kısa bir süre sonra transition aktif edilir ve animasyon başlatılır
  setTimeout(() => {
    roundHorses.forEach((h) => {
      transitions.value[h.id] = true
    })
    animateHorses(roundHorses)
  }, 50)
})

// Bir atın mevcut pozisyonunu (yüzdelik olarak) döner
const getHorsePosition = (horseId) => positions.value[horseId] || 3

// Bir at için geçerli transition stilini döner
const getHorseTransition = (horseId) => (transitions.value[horseId] ? 'left 0.1s linear' : 'none')

// Atın belirtilen süre boyunca pistte ileri gitmesini sağlayan animasyon fonksiyonu
const animateHorses = (horses) => {
  horses.forEach((horse) => {
    const duration = horse.animationDuration || 4000 // animasyon süresi
    const startTime = performance.now()
    const id = horse.id

    const step = () => {
      if (!store.state.races.isRunning) return

      const elapsed = performance.now() - startTime
      const progress = Math.min((elapsed / duration) * 100, 100) // % olarak ilerleme hesapla

      positions.value[id] = progress // pistteki ilerlemeyi güncelle

      if (progress < 100) {
        requestAnimationFrame(step) // bir sonraki kareye geç
      }
    }

    requestAnimationFrame(step) // animasyonu başlat
  })
}
</script>

<style scoped>
.race-track {
  background: #eee;
  border: 2px solid #ccc;
  padding: 10px;
  min-height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 2px solid red;
}
.lane {
  position: relative;
  height: 57px;
  background: white;
  border-bottom: 1px dashed #ccc;
}
.lane-number {
  transform: rotate(-90deg);
  height: 28px;
  width: 56px;
  text-align: center;
  position: relative;
  left: -14px;
  background-color: #609b2b;
  color: #fff;
}
.horse {
  position: absolute;
  top: 13px;
  height: 30px;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
}
.horse-info {
  position: absolute;
  top: -10px;
  color: #000;
  font-size: 12px;
  font-weight: 400;
}
.color-box {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  margin-right: 6px;
  border: 1px solid #666;
  vertical-align: middle;
}
</style>
