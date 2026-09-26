<script setup>
import { RouterLink } from 'vue-router'

defineProps({ menus: { type: Array, required: true } })
const emit = defineEmits(['navigate'])
</script>

<template>
  <li v-for="menu in menus" :key="menu.id">
    <RouterLink v-if="menu.path" :to="menu.path" @click="emit('navigate')">{{ menu.label }}</RouterLink>
    <span v-else class="submenu-label">{{ menu.label }}</span>
    <ul v-if="menu.children?.length" class="submenu-children">
      <SubmenuItems :menus="menu.children" @navigate="emit('navigate')" />
    </ul>
  </li>
</template>
