<template>
  <div class="index-page">
    <ResultTable :data="results" />
  </div>
</template>

<script setup lang="ts">
import { doQualityCalculations } from '~/calculator/quality-calculator';

const results = doQualityCalculations();
</script>

<style lang="scss" scoped>
</style>

