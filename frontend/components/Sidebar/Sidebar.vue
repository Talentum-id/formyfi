<template>
  <div class="sidebar flex justify-between flex-col" :class="{ open: isOpen, mobile: isMobile() }">
    <div
      :class="{ open: !isOpen, mobile: isMobile(), scrolled: isScrolled, isSafari: isSafariActive }"
      class="link-list flex justify-between flex-col"
    >
      <div>
        <SidebarLink
          v-for="menuLink in MENU_LINKS"
          :menuLink="menuLink"
          :key="menuLink.name"
          :isOpen="isOpen"
        />
      </div>
    </div>
    <button v-if="!isMobile()" class="sidebar-btn" @click="open">
      <img :class="{ reverse: isOpen }" src="@/assets/images/Left.svg" alt="" />
    </button>
  </div>
</template>

<script>
import MENU_LINKS from '@/constants/menuLinks';
import windowSizeMixin from '@/mixins/windowSizeMixin';

export default {
  name: 'Sidebar',
  mixins: [windowSizeMixin],
  props: {
    isOpen: { type: Boolean, default: false },
    open: { type: Function },
  },
  data() {
    return {
      isClicked: false,
      MENU_LINKS,
      isScrolled: false,
      isSafari: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 72) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    },
  },
};
</script>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { isSafari } from '@/util/helpers';
import SidebarLink from '@/components/Sidebar/SidebarLink.vue';

const isSafariActive = ref(false);
onMounted(() => {
  const isActive = isSafari();
  isSafariActive.value = !!isActive;
});
</script>

<style scoped lang="scss">
.sidebar-icon {
  filter: invert(44%) sepia(17%) saturate(642%) hue-rotate(197deg) brightness(95%) contrast(93%);
}

.active-link {
  color: $section-title;
  background: $default-border;
  border-radius: 8px 0px 0px 8px;

  .sidebar-icon {
    filter: none;
  }
}

.change-color {
  stroke: red;
}

.link-list {
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  color: $secondary;
  height: 100%;
  transition: transform 0.5s ease-in-out;

  &.isSafari {
    li {
      margin: 0;
      padding: 0;
    }
  }

  &.scrolled {
    transform: translateY(-100px);
  }

  .link-name {
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
    width: 1px;
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

.link-item {
  padding: 12px 14px;
  display: flex;
  width: 100%;
  gap: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  padding: 105px 0 10px 0;
  width: 100%;
  max-width: 72px;
  background-color: $default-bg;
  height: 100vh;
  z-index: 100;
  transition: max-width 0.5s ease-in-out;
  will-change: max-width;
  border-right: 1px solid $default-border;
  color: black;

  &.mobile {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 0px;
    opacity: 0;
  }
}

.sidebar.open {
  max-width: 200px;
  opacity: 1;
}

.sidebar-btn {
  position: absolute;
  bottom: 150px;
  right: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: $default-bg;
  border: 1px solid $default-border;

  &:hover {
    background-color: #dad9f7;
  }
}

.reverse {
  transform: rotate(180deg);
}

.set-up {
  margin: 10px 0 10px 8px;
  display: flex;
  width: 168px;
  padding: 10px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #ffb580;
  background: $white;

  .title {
    color: $orange;
    font-family: $default_font;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  .progress {
    color: $secondary;
    font-family: $default_font;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.168px;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    .button {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 3px 8px;
      align-items: center;
      border-radius: 6px;
      border: 1px solid $default-badge-border;
      background: $default-bg;
      color: $default;
      font-family: $default_font;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.168px;
    }
  }
}

.beta {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  margin-left: -8px;
  margin-top: -8px;
  transition-duration: 0.5s;
  width: 200px;

  .msg {
    color: $secondary;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: $default_font;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.154px;
  }
}

@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  .scrolledBeta {
    top: -20%;
    transition-duration: 0.5s;
  }
}

/* Стиль для Firefox */
@-moz-document url-prefix() {
  .scrolledBeta {
    top: 0;
    transition-duration: 0.5s;
  }
}

.hide {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}
</style>