<template>
  <footer class="footer" :class="{ mobile: isMobile() }">
    <div class="title">Formyfi {{ new Date().getFullYear() }}</div>
    <div class="info">
      <span> Follow us</span>
      <div class="socials cursor-pointer">
        <img
          src="@/assets/icons/x.png"
          @click="goToSocial('https://twitter.com/formyfi_io')"
          alt="x"
        >
      </div>
    </div>
  </footer>
</template>

<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';
import Icon from '@/components/Icons/Icon.vue';

export default {
  components: { Icon },
  mixins: [windowSizeMixin],
  name: 'Header',
  methods: {
    goToSocial(link) {
      window.open(link, '_blank');
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  display: flex;
  align-items: center;
  gap: 25px;

  span {
    font-family: $default_font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: $secondary;
  }
}

.socials {
  display: flex;
  align-items: center;
  gap: 30px;

  img {
    height: 24px;
  }
}

.title {
  display: flex;
  align-items: center;

  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: $secondary;
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: $default-bg;
  height: 72px;
  max-height: 72px;
  border-top: 1px solid $default-border;
  position: relative;
  z-index: 204;
  margin-top: 72px;
  padding: 0 32px 0 32px;

  &.mobile {
    flex-direction: column;
    padding: 10px 20px;
  }
}
</style>
