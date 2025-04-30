<script setup>
import Loading from '@/assets/icons/modal/loading.vue';
import { ElImage } from 'element-plus';
import { ref } from 'vue';

const loadingImage = ref(true);
const loading = () => {
  loadingImage.value = false;
};
defineProps({
  image: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div :style="`width: ${width}px; height: ${height}px`" class="container">
    <Loading v-if="loadingImage"></Loading>
    <el-image
      :style="`width: ${width}px; height: ${height}px`"
      @load="loading"
      loading="eager"
      class="banner"
      lazy
      fit="cover"
      :src="image"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :initial-index="0"
      :preview-src-list="[image]"
      v-show="!loadingImage"
    />
  </div>
</template>

<style scoped lang="scss">
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.banner {
  border-radius: 8px;
  overflow: hidden;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
