<template>
  <div class="toast-message form-toast-message">
    <div class="toast-message-success">
      <div class="toast-message-success-icon-blur">
        <div class="toast-message-success-icon">
          <i class="icon-success"></i>
        </div>
      </div>
      <div class="toast-message-success-content">
        <p>{{ toastMessageText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToastMessage",
  props: ['toastMessageText']
};
</script>

<style>
@import url(./ToastMessage.css);
</style>
