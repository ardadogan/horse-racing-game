export default {
  namespaced: true,
  state: () => ({
    horses: [],
  }),
  mutations: {
    setHorses(state, horses) {
      state.horses = horses
    },

    // Belirli bir at için animasyon süresi atanır (pistteki hareket için kullanılır)
    setHorseAnimationDuration(state, { horseId, duration }) {
      const horse = state.horses.find((h) => h.id === horseId)
      if (horse) {
        horse.animationDuration = duration
      }
    },
  },

  actions: {
    generateHorses({ commit }) {
      const names = [
        'Thunderbolt',
        'Midnight Blaze',
        'Crimson Arrow',
        'Storm Chaser',
        'Golden Dust',
        'Shadow Dancer',
        'Silver Comet',
        'Iron Mane',
        'Mystic River',
        'Dark Mirage',
        'Gulbatur',
        'Wild Whisper',
        'Eclipse Runner',
        'Desert Flame',
        'Winter Howl',
        'Jetstream',
        'Sahbatur',
        'Sapphire Wind',
        'Ghost Hoof',
        'Luna Strike',
      ]
      const colors = [
        '#DC143C',
        '#4169E1',
        '#DAA520',
        '#228B22',
        '#FF4500',
        '#6A5ACD',
        '#FF1493',
        '#40E0D0',
        '#A0522D',
        '#9400D3',
      ]

      // Diziyi karıştırmak için
      const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

      // İsimler ve renkler karıştırılır
      const shuffledNames = shuffle([...names])
      const doubledColors = [...colors, ...colors] // 20 at için renk yeterli olsun diye iki katına çıkarılır
      const shuffledColors = shuffle(doubledColors)

      // 1-20 arası atlar oluşturulur
      const horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i], // Karışık isim atanır
        color: shuffledColors[i], // Karışık renk atanır
        condition: Math.floor(Math.random() * 100) + 1, // 1-100 arası kondisyon atanır
      }))

      commit('setHorses', horses)
    },
  },

  getters: {
    getHorses: (state) => state.horses,
  },
}
