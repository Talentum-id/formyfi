<template>
  <span
    v-if="menuLink"
    class="sidebar-link"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <router-link
      exact-active-class="active-link"
      class="link-item"
      :class="{ open: !isOpen }"
      :to="menuLink.to"
    >
      <Icon :name="menuLink.img" :size="24" class="sidebar-icon" />
      <span class="link-name">{{ menuLink.name }}</span>
    </router-link>
  </span>
</template>

<script setup>
import MENU_LINKS from '@/constants/menuLinks';
import { ref } from 'vue';
import Icon from '@/components/Icons/Icon.vue';

const isHovered = ref(false);

const props = defineProps({
  sidebarMenuId: { type: String, default: '' },
  isOpen: { type: Boolean, default: false },
  menuLink: { type: Object, default: null },
});
</script>

<style lang="scss" scoped>
.sidebar-link {
  position: relative;
}

.sidebar-link-tooltip {
  position: absolute;
  top: 10px;
  left: 70px;
  background: rgba(56, 64, 91, 1);
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  padding: 8px;
  border-radius: 8px;

  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
  color: $white;

  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background: rgba(56, 64, 91, 1);
    transform: rotate(45deg) translateX(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: -1;
    top: 13px;
    left: 3px;
    border-radius: 3px;
  }

  &.open {
    display: none;
    left: 200px;
  }
}

.active-link {
  color: $section-title;
  background: #e9ecf2;
  border-radius: 8px 0px 0px 8px;

  .sidebar-icon {
    filter: none;
  }
}

.link-item {
  padding: 12px 14px;
  display: flex;
  gap: 10px;
  text-decoration: inherit;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
  align-items: center;

  &:hover:not(.active-link) {
    background-color: #e9ecf2;
    border-radius: 8px 0px 0px 8px;
  }

  &.open {
    .link-name {
      opacity: 0;
      width: 1px;
      cursor: none;
      pointer-events: none;
    }
  }
}

.link-name {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
  width: 1px;
  white-space: nowrap;
}
</style>
