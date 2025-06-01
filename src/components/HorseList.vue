<template>
  <div class="col-lg-3 mb-3 mb-lg-0">
    <div class="mr-3 horse-list" v-if="horses.length">
      <h5 class="text-center">Horse List ( 1 - {{ horses.length }} )</h5>
      <table v-if="horses.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.condition }}</td>
            <td>
              <span
                class="color-box"
                :style="{ backgroundColor: horse.color.toLowerCase() }"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No horses generated yet.</p>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const horses = computed(() => store.state.horses.horses)
</script>

<style scoped>
.horse-list {
  background: #f5f5f5;
  padding: 10px;
  border: 1px solid #ccc;
  max-height: 600px;
  overflow-y: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 6px;
  border-bottom: 1px solid #ddd;
  font-size: 10px;
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

h5 {
  font-size: 14px;
}
</style>
