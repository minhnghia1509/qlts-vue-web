<template>
  <div class="wrapper">
    <div class="dialog-format form-validate">
      <div class="dialog-header">
        <i class="icon-warning"></i>
        <div class="dialog-header-content">
          Thông tin bạn thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn
          có muốn lưu các thay đổi này?
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-no" @click="onCloseWarning" ref="btnBackWarningSave" tabindex="100">Huỷ</button>
        <button
          class="btn btn-border-blue btn-dont-save"
          @click="onCloseNotSave"
          tabindex="101"
        >
          Không lưu
        </button>
        <button class="btn btn-blue" @click="onSaveForm" @keydown="lastItemTab" tabindex="102">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script>
import Enums from '@/helpers/enum';
export default {
  name: "MWarningSave",
  props: {
    text: String,
  },
  mounted() {
    this.$refs.btnBackWarningSave.focus();
  },
  methods: {
    onCloseWarning() {
      this.$emit("closeMWarningSave");
    },
    onSaveForm() {
      this.$emit("onSave");
    },
    onCloseNotSave() {
      this.$emit("onCloseFormUpdate");
    },
    lastItemTab() {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Tab:
          event.preventDefault();
        this.$refs.btnBackWarningSave.focus();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
@import url("./MWarningSave.css");
</style>
