<script setup></script>

<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.card {
  border-radius: 16px;
  width: 100%;
  height: 100%;
  border: 1px solid $default-border;
  background: $white;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .step {
      color: #a5acbb;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }

    .required {
      color: $error-border;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.168px;
    }
  }

  .title {
    color: $primary-text;
    font-variant-numeric: slashed-zero;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }

  img {
    text-align: center;
    width: 120px;
    border-radius: 8px;
  }
}
</style>
