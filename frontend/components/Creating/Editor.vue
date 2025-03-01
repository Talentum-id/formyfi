<template>
  <div class="editor-wrapper" :class="{ isError, isEdit }">
    <quill-editor
      v-model:content="data"
      contentType="html"
      :toolbar="toolbarOptions"
      :class="`editor-text ${textClass && textClass}`"
      :placeholder="placeholder"
      @paste="handlePaste"
    >
    </quill-editor>
  </div>
  <div v-if="errorText && isError" class="editor-error">
    {{ errorText }}
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted, toRef } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
// import { sanitizeHtml, removeTagsStylesClasses, replaceWordsWithEmptyString } from '~~/util/helpers';

const content = ref('');

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  ['code-block', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],

];

const emits = defineEmits(['update']);
const props = defineProps({
  isError: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
  description: { type: String, default: '' },
  placeholder: {
    type: String,
    default: 'Enter Q&A description',
  },
  textClass: { type: String, default: null },
});
const data = ref(props.description);

const defaultDataPropRef = toRef(props, 'description');

watch(defaultDataPropRef, (value) => {
  data.value = value;
});

const handlePaste = (event) => {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(pastedText));
  }

  emits('update', data.value);
};

watch(data, (newData) => {
  emits('update', newData);
});
</script>

<style lang="scss">
.editor-projects p {
  font-size: 20px !important;
  line-height: 32px !important;
  color: $section-title !important;
}
.editor-error {
  color: $error-text;
  font-family: $default_font;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings:
    'tnum' on,
    'lnum' on,
    'zero' on;
}
</style>
