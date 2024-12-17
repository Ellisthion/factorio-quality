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
      <ItemIcon :icon="machine.icon" />
      </button>
    </div>

    <div class="form">
      <label>Machine</label>
      <span>{{ selectedMachine.name }}</span>

      <label>Module Slots</label>
      <span>{{ selectedMachine.moduleSlots }}</span>

      <label>Machine Productivity</label>
      <span>{{ selectedMachine.productivity }}%</span>

      <label for="researchProductivity">Research Productivity</label>

      <div>
        <input id="researchProductivity" v-model="researchProductivity" type="number" step="10" min="0" max="400" />
        <span>&nbsp;%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { machines, type Machine } from '~/calculator/machines';

const model = defineModel<CalculatorConfig>();

model.value = buildConfig({});

const selectedMachine = ref<Machine>(machines[0]);
const researchProductivity = ref(0);

watch([selectedMachine, researchProductivity], () => {
  updateConfig()
}, { immediate: true });

function updateConfig() {
  model.value = buildConfig({
    machineProductivity: selectedMachine.value.productivity,
    researchProductivity: researchProductivity.value,
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
}

.options {
  display: flex;
  gap: 0.5rem;
}

dl, .form {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 0.5rem 1rem;

  dt, dd {
    margin: 0;
  }

  dt {
    font-weight: bold;
  }
}

label {
  font-weight: bold;
}

input {
  width: 4rem;
  display: inline-block;
}
</style>


