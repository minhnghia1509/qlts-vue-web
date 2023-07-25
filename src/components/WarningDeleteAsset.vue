<template>
  <div class="wrapper" v-enter="onCloseWarning">
    <div class="dialog-format form-validate">
      <div class="dialog-header">
        <i class="icon-warning"></i>
        <div class="dialog-header-content">
          <p v-if="listData.length == 2">
            Tài sản có mã <span>{{ listData[0] }}</span> đã phát sinh chứng từ
            ghi tăng có mã
            <span>{{ listData[1] }}</span>
          </p>
          <p v-if="listData.length == 1">
            {{ listData[0] }} tài sản phát sinh chứng từ ghi tăng
          </p>
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn btn-blue form-validate-btn"
          @click="onCloseWarning"
          ref="btn"
        >
          <p>Đồng ý</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MWarningDefault",
  props: ["listData"],
  mounted() {
    this.$refs.btn.focus();
  },
  methods: {
    onCloseWarning() {
      this.$emit("closeWarning");
    },
  },
  data() {
    return {
      listError: [],
    };
  },
};
</script>

<style>
@import url("./MWarningDefault/MWarningDefault.css");
</style>
