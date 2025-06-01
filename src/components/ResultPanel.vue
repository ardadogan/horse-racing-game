<template>
  <div class="col-lg-9 mt-3">
    <div class="result-panel" v-if="results.length">
      <div v-if="results.length === 0">No results yet</div>
      <div class="row">
        <div v-for="(result, index) in results" :key="index" class="result-round col-lg-4">
          <h5 class="text-center">{{ index + 1 }}. LAP - {{ result[0].distance }}m</h5>
          <table>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, i) in result" :key="horse.id">
                <td>{{ i + 1 }}</td>
                <td>{{ horse.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const results = computed(() => store.state.races.results)
</script>

<style scoped>
.result-panel {
  background: #d9f5d5;
  border: 1px solid #80cc80;
  padding: 10px;
  overflow-y: auto;
}
.result-round {
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
