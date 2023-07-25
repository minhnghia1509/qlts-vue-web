<template>
  <div class="wrapper" v-enter="onCloseWarning">
    <div class="dialog-format form-validate">
      <div class="dialog-header">
        <i class="icon-warning"></i>
        <ul class="dialog-header-content">
          <li
            v-for="(item, index) of listError"
            :key="index"
            class="dialog-header-content-item"
          >
            {{item }}
          </li>
        </ul>
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
  props: ['text'],
  created() {
    if (Array.isArray(this.text)){
      this.listError = this.text;
    }
    else {
      this.listError = this.text.split("/");
    }
    if (this.listError.length > 1) {
      for (let i = 0; i < this.listError.length; i++) {
        this.listError[i] = "- " + this.listError[i];
      }
    }
  },
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
@import url("./MWarningDefault.css");
</style>
