<template>
  <div class="container">
    <ControlPanel />
    <div class="main row">
      <HorseList />
      <RaceTrack />
      <ProgramPanel />
      <ResultPanel />
    </div>
  </div>
</template>

<script setup>
import ControlPanel from '../components/ControlPanel.vue'
import HorseList from '../components/HorseList.vue'
import RaceTrack from '../components/RaceTrack.vue'
import ProgramPanel from '../components/ProgramPanel.vue'
import ResultPanel from '../components/ResultPanel.vue'
</script>

<style scoped>
.container {
  padding: 20px;
}
.main {
  display: flex;
}
</style>
