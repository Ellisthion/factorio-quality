<template>
  <div class="index-page">
    <ResultTable :data="results" :sample-size="50" />
  </div>
</template>

<script setup lang="ts">
import { qualityFromName } from '~/calculator/constants';
import { CycleCalculator } from '~/calculator/cycle-calculator';

const cycleCalculator = new CycleCalculator({
  machineProductivity: 0,
  moduleSlots: 4,
  keepQuality: qualityFromName('Normal')
}, [2, 2, 2, 2, 0]);

const results = cycleCalculator.craftCycle(1);
</script>

<style lang="scss" scoped>
</style>

