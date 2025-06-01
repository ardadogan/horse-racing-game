export default {
  namespaced: true,
  state: () => ({
    schedule: [],
    currentRound: 0,
    results: [],
    isRunning: false,
  }),
  mutations: {
    setSchedule(state, schedule) {
      state.schedule = schedule
    },
    addResult(state, result) {
      state.results.push(result)
    },
    setRunning(state, running) {
      state.isRunning = running
    },
    nextRound(state) {
      state.currentRound++
    },
    resetRace(state) {
      state.currentRound = 0
      state.results = []
    },
  },
  actions: {
    // Yarış programı (schedule) oluşturur
    generateSchedule({ commit, rootState }) {
      // Her bir turun koşulacağı mesafeler (metre cinsinden)
      const distances = [1200, 1400, 1600, 1800, 2000, 2200]

      // Tüm atlar horses modülündeki state'ten alınır
      const allHorses = rootState.horses.horses

      // 6 yarış turu oluşturulur
      const schedule = distances.map((distance) => {
        // Atlar rastgele sıralanır ve ilk 10'u seçilir
        const selected = [...allHorses].sort(() => 0.5 - Math.random()).slice(0, 10)

        // Her tur için mesafe ve seçilen atlar belirlenir
        return { distance, horses: selected }
      })

      // Vuex state'e programı kaydeder
      commit('setSchedule', schedule)

      // Mevcut tur, sonuçlar vs. gibi bilgileri sıfırlar
      commit('resetRace')
    },
  },
  getters: {
    getSchedule: (state) => state.schedule,
    getResults: (state) => state.results,
    getCurrentRound: (state) => state.currentRound,
  },
}
