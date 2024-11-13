<template>
  <span class="tag active" v-if="data.status" @click="goToLink(data.value)">
    <Icon
      v-if="data.icon.includes('-Default') || data.icon === 'Google'"
      class="icon"
      :icon="data.icon"
      :size="24"
    ></Icon>
    <img v-else class="custom-icon" :src="data.icon" alt="" />
    {{ showName ? data.name : data.value }}
    <Icon
      v-if="!hideRemove"
      class="remove-tag"
      @click="$emit('remove')"
      icon="Cancel"
      :size="16"
    />
  </span>
  <span v-else class="tag" @click="$emit('connect')">
    <Icon
      v-if="data.icon.includes('-Default') || data.icon === 'Google'"
      class="icon"
      :icon="data.icon"
      :size="24"
    ></Icon>
    <img v-else class="custom-icon" :src="data.icon" alt="" />
    Connect {{ capitalizedName }}
  </span>
</template>

<script>
import Icon from '@/components/Icons/Icon.vue';

export default {
  name: 'SocialTag',
  components: { Icon },
  props: {
    hideRemove: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    connector: {
      type: Object,
      default: () => {},
    },
    hrefToLink: {
      type: Boolean,
      default: false,
    },
    showName: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    capitalizedName() {
      return this.data?.name?.charAt(0).toUpperCase() + this.data.name.slice(1);
    },
  },
  methods: {
    ensureProtocol(url) {
      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');

      if (!hasProtocol) {
        return `http://${url}`;
      }

      return url;
    },
    goToLink(value) {
      if (this.hrefToLink && value) {
        window.open(this.ensureProtocol(value), '_blank').focus();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tag {
  display: flex;
  align-items: center;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 8px;
  font-family: $default_font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  height: 40px;
  width: max-content;
  transition-duration: .3s;
}
.tag:hover {
  background: $default-bg;
}
.tag.active {
  background: $default-bg;
}
.icon {
  margin-right: 10px;
}
.custom-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}
</style>
