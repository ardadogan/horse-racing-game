<template>
  <div class="control-panel row">
    <div class="col-lg-6">
      <h1>🏇 Horse Racing Game</h1>
    </div>
    <div class="col-lg-6 d-flex justify-content-end">
      <button :disabled="isRunning" class="btn btn-light mx-3" @click="generate">
        Generate Program
      </button>
      <button :disabled="isRunning" class="btn btn-light" @click="startRace">Start Race</button>
    </div>
    <!-- TUR MODALI -->
    <Teleport to="body">
      <div v-if="showModal" class="custom-modal-overlay">
        <div class="custom-modal">
          <h3 class="py-2" v-if="isFinalRound">Race Completed!</h3>
          <h3 class="py-2" v-else>Round {{ currentRoundIndex + 1 }} Completed!</h3>
          <p><strong>Winner:</strong> {{ winner?.name }} – {{ winner?.time }}s</p>
          <button class="btn btn-light" @click="proceedToNextRound">
            {{ isFinalRound ? 'Close' : 'Proceed to Next Round' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const store = useStore()

// Oyunun şu anda çalışıp çalışmadığını kontrol eder (yarış devam ediyor mu)
const isRunning = computed(() => store.state.races.isRunning)

// Şu anki turun indeksini alır
const currentRoundIndex = computed(() => store.state.races.currentRound)

// Modal gösterimi ve kazanan bilgisi için reaktif değişkenler
const showModal = ref(false)
const winner = ref(null)
const nextRoundResolve = ref(null) // round sonrası devam etmek için Promise çözümü

// Oyunun son turda olup olmadığını kontrol eder
const isFinalRound = computed(() => {
  const totalRounds = store.state.races.schedule.length
  return currentRoundIndex.value === totalRounds - 1
})

// "Generate Program" butonuna tıklanınca çağrılır
// Atları ve yarış programını oluşturur
const generate = () => {
  store.dispatch('horses/generateHorses') // Yeni at listesi oluştur
  store.dispatch('races/generateSchedule') // 6 turluk yarış programı oluştur
  store.commit('races/setRunning', false) // Yarış sıfırlanır (başlatılmamış hale gelir)
}

// "Start Race" butonuna tıklanınca çağrılır
// Yarış başlatılır
const startRace = () => {
  store.commit('races/setRunning', true) // Yarış durumu aktif yapılır
  startRaceLoop() // Turlar sırayla başlatılır
}

// Tüm turları sırayla oynatan asenkron fonksiyon
const startRaceLoop = async () => {
  // Yarış devam ettiği sürece ve tüm turlar tamamlanmadıkça döner
  while (
    store.state.races.currentRound < store.state.races.schedule.length &&
    store.state.races.isRunning
  ) {
    const roundIndex = store.state.races.currentRound
    const round = store.state.races.schedule[roundIndex]

    // Her at için süre hesaplanır (koşulacak mesafe, kondisyon, rastgelelik faktörü)
    const result = [...round.horses].map((horse) => {
      const randomFactor = Math.random() * 2 // 0–2 arası rastgele ek süre
      const time = round.distance / 100 + (100 - horse.condition) * 0.07 + randomFactor
      return { ...horse, time: parseFloat(time.toFixed(2)), ...round }
    })

    // Animasyon süresi Vuex store’a işlenir (görsel hareketle eşleşsin diye)
    result.forEach((horse) => {
      store.commit('horses/setHorseAnimationDuration', {
        horseId: horse.id,
        duration: horse.time * 1000, // milisaniyeye çevrilir
      })
    })

    // Her atın süresi kadar beklenir, bu animasyonla eşzamanlı ilerlemeyi sağlar
    await Promise.all(
      result.map(
        (horse) =>
          new Promise((resolve) => {
            setTimeout(resolve, horse.time * 1000)
          }),
      ),
    )

    // Hızlıdan yavaşa sıralanır, kazanan en az süreye sahip olandır
    result.sort((a, b) => a.time - b.time)

    // Sonuç Vuex store’a kaydedilir
    store.commit('races/addResult', result)

    // Kazanan ve modal gösterimi ayarlanır
    winner.value = result[0]
    showModal.value = true

    // Kullanıcı modalda "Sonraki Tura Geç" diyene kadar beklenir
    await new Promise((resolve) => {
      nextRoundResolve.value = resolve
    })

    // Bir sonraki tura geçilir
    store.commit('races/nextRound')
  }

  // Tüm turlar bittiğinde yarış durumu pasif yapılır
  store.commit('races/setRunning', false)
}

// Kullanıcı modal üzerindeki butona tıklayınca çağrılır
const proceedToNextRound = () => {
  showModal.value = false

  // Bir önceki Promise çözülür, bir sonraki tur başlar
  if (nextRoundResolve.value) {
    nextRoundResolve.value()
    nextRoundResolve.value = null
  }

  // Son turdaysa yarış sona erer
  if (isFinalRound.value) {
    store.commit('races/setRunning', false)
  }
}
</script>

<style scoped>
.control-panel {
  display: flex;
  margin-bottom: 1rem;
}
button {
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.custom-modal {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
}
</style>
