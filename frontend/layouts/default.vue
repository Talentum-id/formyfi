<template>
  <div class="main-wrapper" v-if="!loading && isDesktop">
    <Header :open="toggleSidebar" />
    <div class="main-content" :class="{ open: sidebarOpen, mobile: isMobile() }">
      <Sidebar :open="toggleSidebar" :isOpen="sidebarOpen" />
      <div class="children-content" :class="{ open: sidebarOpen }">
        <slot></slot>
      </div>
    </div>
    <div class="footer_wrapper">
      <Footer />
    </div>
  </div>
  <ScreenStub v-if="!loading && !isDesktop"></ScreenStub>
</template>
<script setup>
import ScreenStub from '@/components/ScreenStub.vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import Footer from '@/components/Footer/Footer.vue';
import Header from '@/components/Header/Header.vue';
import { computed } from 'vue';

const isDesktop = computed(
  () => window.innerWidth > 1330 || (localStorage.scale != 'false' && localStorage.scale),
);
</script>
<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';

export default {
  mixins: [windowSizeMixin],
  data() {
    return {
      sidebarOpen: true,
      loading: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
};
</script>

<style scoped lang="scss">
.footer_wrapper {
  margin-top: auto;
  position: relative;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 30;
  height: 100%;
  background-color: $default-bg;
  min-height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
}

.children-content {
  padding: 48px 40px 0 120px;
  min-height: 100vh;
  transition: padding-left 0.5s ease-in-out;

  &.open {
    padding-left: 240px;
  }
}

.main-content {
  width: 100%;
  height: 100%;
  position: relative;
  transition: grid-template-columns 0.5s ease-in-out;
}

.main-content.open {
  grid-template-columns: 200px 1fr;
}

.main-content.mobile {
  grid-template-columns: 1fr;
}
</style>
