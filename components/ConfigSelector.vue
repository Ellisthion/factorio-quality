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


    <div class="part-module">
      <label>Quality Modules</label>

      <div class="options">
        <button
          v-for="tier of 3" :key="tier"
          type="button"
          class="button option option-quality-tier"
          :class="{ 'is-active': tier === selectedQualityTier }"
          @click="selectedQualityTier = (tier as ModuleTier)"
        >
          <ItemIcon :icon="`Quality_module${tier === 1 ? '' : '_' + tier}`" />
        </button>
      </div>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          class="button option option-quality-quality"
          :class="{ 'is-active': quality === selectedQualityQuality }"
          @click="selectedQualityQuality = (quality as QualityTier)"
        >
          <ItemIcon :icon="qualityName" />
        </button>
      </div>
    </div>

    <div class="part-module">
      <label>Productivity Modules</label>
    
      <div class="options">
        <button
          v-for="tier of 3" :key="tier"
          type="button"
          class="button option option-productivity-tier"
          :class="{ 'is-active': tier === selectedProductivityTier }"
          @click="selectedProductivityTier = (tier as ModuleTier)"
        >
          <ItemIcon :icon="`Productivity_module${tier === 1 ? '' : '_' + tier}`" />
        </button>
      </div>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          class="button option option-productivity-quality"
          :class="{ 'is-active': quality === selectedProductivityQuality }"
          @click="selectedProductivityQuality = (quality as QualityTier)"
        >
          <ItemIcon :icon="qualityName" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildConfig, type CalculatorConfig } from '~/calculator/calculator-config';
import { qualities, qualityFromName, type ModuleTier, type Quality, type QualityTier } from '~/calculator/constants';
import { machines, type Machine } from '~/calculator/machines';

const model = defineModel<CalculatorConfig>();

model.value = buildConfig({});

const selectedMachine = ref<Machine>(machines[0]);
const researchProductivity = ref(0);

const selectedProductivityTier = ref<ModuleTier>(3);
const selectedProductivityQuality = ref<QualityTier>(qualityFromName('Legendary'));
const selectedQualityTier = ref<ModuleTier>(3);
const selectedQualityQuality = ref<QualityTier>(qualityFromName('Legendary'));

watch([
  selectedMachine,
  researchProductivity,
  selectedProductivityTier,
  selectedProductivityQuality,
  selectedQualityTier,
  selectedQualityQuality
], () => {
  updateConfig()
}, { immediate: true });

function updateConfig() {
  model.value = buildConfig({
    machineProductivity: selectedMachine.value.productivity,
    researchProductivity: researchProductivity.value,
    moduleSlots: selectedMachine.value.moduleSlots,

    // maxQuality: qualityFromName('Legendary'),
    // keepQuality: qualityFromName('Legendary'),
    
    productivityModuleTier: selectedProductivityTier.value,
    productivityModuleQuality: selectedProductivityQuality.value,

    qualityModuleTier: selectedQualityTier.value,
    qualityModuleQuality: selectedQualityQuality.value

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

.part-module {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>


