<template>
  <div class="wrapper">
    <div class="dialog-format form-validate">
      <div class="dialog-header">
        <i class="icon-warning"></i>
        <div class="dialog-header-content">
          {{ text }}
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn btn-no"
          @click="onCloseWarning"
          ref="btnBack"
          tabindex="103"
        >
          Không
        </button>
        <button
          class="btn btn-blue"
          @click="onDeleteWarning"
          tabindex="104"
          @keydown="lastItemTab"
        >
          <p>Xoá</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Enums from "@/helpers/enum";
export default {
  name: "MWarningDelete",
  props: {
    text: String,
  },
  mounted() {
    this.$refs.btnBack.focus();
  },
  methods: {
    onCloseWarning() {
      this.$emit("closeMWarningDelete");
    },
    onDeleteWarning() {
      this.$emit("onDelete");
    },
    lastItemTab() {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Tab:
          event.preventDefault();
        this.$refs.btnBack.focus();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
@import url("./MWarningDelete.css");
</style>
