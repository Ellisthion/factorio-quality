<template>
  <div class="result-table-component">
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="quality of qualities" :key="quality">{{ quality }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Sample
          </td>
          <td v-for="(q, i) of qualities" :key="q">
            {{ formatValue(data[i] * sampleSize, 'outputs') }}
          </td>
        </tr>
        <tr>
          <td>
            Percentage
          </td>
          <td v-for="(q, i) of qualities" :key="q">
            {{ formatValue(data[i], 'percentage') }}
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { qualities } from '~/calculator/constants';

const props = defineProps<{
  data: number[],
  sampleSize: number
}>();

function formatValue(v: number, format: 'percentage' | 'outputs'): string {
  switch (format) {
    case 'percentage': {
      const decimalPlaces = 3;
      const multiplier = Math.pow(10, decimalPlaces);
      return Math.round(v * 100 * multiplier) / multiplier + '%';
    }
    case 'outputs': {
      const decimalPlaces = 3;
      const multiplier = Math.pow(10, decimalPlaces);
      return (Math.round(v * multiplier) / multiplier).toString();
    }
    default:
      throw new Error('Bad arg: ' + v);
  }
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

th, td {
  padding: 0.25rem;

  border: 1px solid black;
  text-align: right;
}
</style>

