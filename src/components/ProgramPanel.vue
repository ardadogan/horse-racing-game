<template>
  <div class="col-lg-3 mt-3">
    <div class="program-panel mr-3" v-if="schedule.length">
      <div v-for="(round, index) in schedule" :key="index" class="program-round">
        <h5 class="text-center">{{ index + 1 }}. LAP – {{ round.distance }}m</h5>
        <table>
          <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, i) in round.horses" :key="horse.id">
              <td>{{ i + 1 }}</td>
              <td>{{ horse.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const schedule = computed(() => store.state.races.schedule)
</script>

<style scoped>
.program-panel {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  max-height: 710px;
  overflow-y: auto;
}
.program-round {
  margin-bottom: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}
th,
td {
  text-align: left;
  padding: 6px;
  border-bottom: 1px solid #ddd;
  font-size: 10px;
}
h5 {
  font-size: 14px;
}
</style>
