<template>
  <div class="config-selector-component">
    <div class="options">
      <button
        v-for="machine of machines" :key="machine.name"
        type="button"
        class="button option"
        :class="{ 'is-active': machine.name === selectedMachine.name }"
        @click="selectedMachine = machine"
        v-tooltip="machine.name"
      >
        <ItemIcon :icon="machine.icon" />
        <div class="icon-label" v-if="machine.iconLabel">{{ machine.iconLabel }}</div>
      </button>
    </div>

    <div class="form">
      <label>Machine</label>
      <span class="truncate">{{ selectedMachine.name }}</span>

      <label>Module Slots</label>
      <span>{{ selectedMachine.moduleSlots }}</span>

      <label>Machine Productivity</label>
      <span>{{ selectedMachine.productivity }}%</span>

      <label>Machine Quality</label>
      <span>{{ selectedMachine.quality }}%</span>

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
          class="button option"
          :class="{ 'is-active': tier === selectedQualityTier }"
          @click="selectedQualityTier = (tier as ModuleTier)"
          v-tooltip="`Quality Module ${tier}`"
        >
          <ItemIcon :icon="`Quality_module${tier === 1 ? '' : '_' + tier}`" />
        </button>
      </div>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          class="button option"
          :class="{ 'is-active': quality === selectedQualityQuality }"
          @click="selectedQualityQuality = (quality as QualityTier)"
          v-tooltip="qualityName"
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
          class="button option"
          :class="{ 'is-active': tier === selectedProductivityTier }"
          @click="selectedProductivityTier = (tier as ModuleTier)"
          v-tooltip="`Productivity Module ${tier}`"
        >
          <ItemIcon :icon="`Productivity_module${tier === 1 ? '' : '_' + tier}`" />
        </button>
      </div>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          class="button option"
          :class="{ 'is-active': quality === selectedProductivityQuality }"
          @click="selectedProductivityQuality = (quality as QualityTier)"
          v-tooltip="qualityName"
        >
          <ItemIcon :icon="qualityName" />
        </button>
      </div>
    </div>

    <div class="part-module">
      <label>Quality to Keep (less is recycled)</label>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          class="button option"
          :class="{ 'is-active': quality === selectedKeepQuality }"
          @click="selectedKeepQuality = (quality as QualityTier)"
          v-tooltip="qualityName"
        >
          <ItemIcon :icon="qualityName" />
        </button>
      </div>
    </div>

    <div class="part-module">
      <label>Highest Unlocked Quality</label>

      <div class="options">
        <button
          v-for="(qualityName, quality) of qualities" :key="quality"
          type="button"
          :disabled="quality <= 1"
          class="button option"
          :class="{ 'is-active': quality === selectedMaxQuality }"
          @click="selectedMaxQuality = (quality as QualityTier)"
          v-tooltip="qualityName"
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

const selectedKeepQuality = ref<QualityTier>(qualityFromName('Legendary'));
const selectedMaxQuality = ref<QualityTier>(qualityFromName('Legendary'));

watch([
  selectedMachine,
  researchProductivity,
  selectedProductivityTier,
  selectedProductivityQuality,
  selectedQualityTier,
  selectedQualityQuality,
  selectedKeepQuality,
  selectedMaxQuality
], () => {
  updateConfig()
}, { immediate: true });

function updateConfig() {
  model.value = buildConfig({
    machineProductivity: selectedMachine.value.productivity,
    machineQuality: selectedMachine.value.quality,
    researchProductivity: researchProductivity.value,
    moduleSlots: selectedMachine.value.moduleSlots,

    maxQuality: selectedMaxQuality.value,
    keepQuality: selectedKeepQuality.value,
    
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
  flex-wrap: wrap;
  gap: 0.5rem;
}

.option {
  position: relative;
}

dl, .form {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;

  overflow-x: hidden;
  max-width: 100%;

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

.icon-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  font-size: 0.625rem;
  font-weight: bold;
  // text-transform: uppercase;
  color: white;
  text-shadow:
    0px 0px 1px black,
    0px 0px 2px black,
    0px 0px 3px black,
    0px 0px 4px black;
}
</style>


