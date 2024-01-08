<template>
  <div id="alert-container">
    <div class="alert" :class="type" :style="{ ...styles }">
      <div class="info-block">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'success', // По умолчанию 'success'
      validator: (value) => ['success', 'error', 'info', 'warning', 'danger'].includes(value),
    },
    message: {
      type: String,
      default: '',
    },
    styles: {
      type: String,
      default: {},
    },
  },
};
</script>

<style lang="scss">
#alert-container {
  z-index: 9999;
  position: fixed;
  width: 236px;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column-reverse; // Вертикальное расположение, новые уведомления добавляются сверху
  gap: 10px; // Расстояние между уведомлениями
  align-items: flex-end; // Выравнивание уведомлений по правому краю
  padding: 10px; // До

  .alert {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: #1a1d29;
    border-radius: 8px;
    padding: 11px 16px;
    min-width: 236px;
  }
  .success {
    background-image: url('@/assets/images/success-alert.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .danger {
    background-image: url('@/assets/images/danger-alert.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .error {
    background-image: url('@/assets/images/error-alert.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .info {
    background-color: #d1ecf1;
    border: 1px solid #bee5eb;
    color: #0c5460;
  }
  .warning {
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    color: #856404;
  }

  .info-block {
    margin: 11px 16px;
  }
}
.fade-out-enter-active,
.fade-out-leave-active {
  transition: opacity 0.5s;
}

.fade-out-enter,
.fade-out-leave-to {
  opacity: 0;
}
</style>
