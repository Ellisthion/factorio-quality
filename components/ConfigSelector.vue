<template>
  <div class="config-selector-component">
    <div class="options">
      <button
        v-for="machine of machines" :key="machine.name"
        type="button"
        class="button option option-machine"
        :class="{ 'is-active': machine.name === selectedMachine.name }"
        @click="selectedMachine = machine"
      >
        {{ machine.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { machines, type Machine } from '~/calculator/machines';

const model = defineModel<CalculatorConfig>();

model.value = buildConfig({});

const selectedMachine = ref<Machine>(machines[0]);

watch([selectedMachine], () => {
  updateConfig()
}, { immediate: true });

function updateConfig() {
  model.value = buildConfig({
    machineProductivity: selectedMachine.value.productivity,
    // researchProductivity: 0,
    moduleSlots: selectedMachine.value.moduleSlots

    // maxQuality: qualityFromName('Legendary'),
    // keepQuality: qualityFromName('Legendary'),
    
    // productivityModuleTier: 3,
    // productivityModuleQuality: qualityFromName('Legendary'),

    // qualityModuleTier: 3,
    // qualityModuleQuality: qualityFromName('Legendary'),

    // epsilon: 0.001 / 100
  })
}
</script>

<style lang="scss" scoped>
.config-selector-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.options {
  display: flex;
  gap: 0.5rem;
}
</style>


