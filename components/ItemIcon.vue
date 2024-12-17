<template>
  <span class="item-icon-component" :icon-size="size">
    <span v-if="icon === 'Quality Module'">
      Q
    </span>

    <span v-else-if="icon === 'Productivity Module'">
      P
    </span>

    <span v-else-if="icon === 'Normal'">
      <img src="~/assets/images/Quality_normal.png" alt="Normal Quality" class="quality-icon" />
    </span>

    <span v-else-if="icon === 'Uncommon'">
      <img src="~/assets/images/Quality_uncommon.png" alt="Uncommon Quality" class="quality-icon" />
    </span>

    <span v-else-if="icon === 'Rare'">
      <img src="~/assets/images/Quality_rare.png" alt="Rare Quality" class="quality-icon" />
    </span>

    <span v-else-if="icon === 'Epic'">
      <img src="~/assets/images/Quality_epic.png" alt="Epic Quality" class="quality-icon" />
    </span>

    <span v-else-if="icon === 'Legendary'">
      <img src="~/assets/images/Quality_legendary.png" alt="Legendary Quality" class="quality-icon" />
    </span>

    <span v-else>
      Unsupported Icon
    </span>
  </span>
</template>

<script setup lang="ts">
import type { Quality } from '~/calculator/constants';

withDefaults(defineProps<{
  icon: 'Quality Module' | 'Productivity Module' | Quality,
  size?: 'normal'
}>(), {
  size: 'normal'
});
</script>

<style lang="scss" scoped>
.item-icon-component {
  --size: 2rem;

  &[icon-size='normal'] {
    --size: 2rem;
  }

  > span {
    display: inline-block;

    height: var(--size);
    width: var(--size);
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center;

    &.quality-icon {
      // Quality icons aren't centered
      object-position: 1px -1px;
    }
  }
}
</style>

