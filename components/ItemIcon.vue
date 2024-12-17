<template>
  <span class="item-icon-component" :icon-size="size">
    <span v-if="icon === 'Normal'">
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
      <img :src=get32px(icon) :alt="icon" />
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon: string,
  size?: 'normal'
}>(), {
  size: 'normal'
});

function get32px(name: string): string {
  const images = import.meta.glob('../assets/images/*', { as: 'url', eager: true }) as Record<string, string>;
  return images[`../assets/images/32px-${name}.png`];
}
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

