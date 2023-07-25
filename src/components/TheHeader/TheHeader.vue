<template>
  <div class="header">
    <p>Danh sách tài sản</p>
    <div class="header-nav-bar">
      <p>Sở tài chính</p>
      <div class="header-year">
        <p>Năm</p>
        <span>2023</span>
        <div class="header-year-move">
          <i class="header-icon-up icon-up"></i>
          <i class="icon-down"></i>
        </div>
      </div>
      <div class="header-notification">
        <i class="icon-bell"></i>
      </div>
      <div class="header-square">
        <i class="icon-square"></i>
      </div>
      <div class="header-question-mark">
        <i class="icon-question-mark"></i>
      </div>
      <div class="header-user"  @click="showLogout=true" v-outSide="event=>{showLogout=false}">
        <div class="header-user-avatar">
          <i class="icon-user"></i>
        </div>
        <div class="header-user-down">
          <i class="icon-down"></i>
          <div class="header-user-logout" @click="logOut" v-if="showLogout">Đăng xuất</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['token'],
  name: "TheHeader",
  methods: {
    logOut() {
      this.$emit('logOut');
      localStorage.removeItem("token");
      this.showLogout = false;
    },
  },
  data() {
    return {
      showLoginForm: false,
      showLogout: false,
    }
  },
  watch: {
    user(val) {
      if (val) {
        this.showLoginForm = false;
      } else {
        this.showLogoutForm = true;
      }
    }
  }
};
</script>

<style>
@import url("./TheHeader.css");
</style>
