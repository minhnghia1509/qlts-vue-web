<template>
  <div class="wrapper">
    <div class="dialog-format">
      <div class="dialog-header">
        <i class="icon-warning"></i>
        <div class="dialog-header-content">
          Bạn có muốn huỷ bỏ khai báo tài sản này?
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-no" @click="onCloseWarning" ref="btnBackCancel" tabindex="201">Không</button>
        <button class="btn btn-blue" @click="onCancelWarning" @keydown="lastItemTab" tabindex="202">Huỷ bỏ</button>
      </div>
    </div>
  </div>
</template>

<script>
import Enums from '@/helpers/enum';
export default {
  name: "MWarningCancel",
  props: {
    text: String,
  },
  mounted() {
    this.$refs.btnBackCancel.focus();
  },
  methods: {
    /**Đóng cảnh báo*/
    onCloseWarning() {
      this.$emit("closeMWarningCancel");
    },
    /**Huỷ tài sản */
    onCancelWarning() {
      this.$emit("onCancel");
    },
    lastItemTab() {
      console.log(12312);
        const keyCode = event.keyCode;
        switch (keyCode) {
          case Enums.KeyBoard.Tab:
            event.preventDefault();
            this.$refs.btnBackCancel.focus();
            break;
          default:
            break;
        }
      },
  },
};
</script>

<style>
@import url("./MWarningCancel.css");
</style>
