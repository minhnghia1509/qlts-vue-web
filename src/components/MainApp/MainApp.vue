<template>
  <SideBar @changePage="changePage"></SideBar>
  <TheBody
    :page="page"
    :token="token"
    @logOut="logOut"
    :reload="reload"
  ></TheBody>
  <LoginForm v-if="!token" @loginSuccess="loginSuccess"></LoginForm>
  <ToastMessage
    v-if="showToastMessage"
    :toastMessageText="toastMessageText"
  ></ToastMessage>
</template>

<script>
import SideBar from "../SideBar/SideBar.vue";
import TheBody from "../TheBody/TheBody.vue";
import LoginForm from "../LoginForm/LoginForm.vue";
import ToastMessage from "../ToastMessage/ToastMessage.vue";
import {Message} from '@/helpers/resource'
export default {
  name: "App",
  created() {
    try {
      this.token = JSON.parse(localStorage.getItem("token"));
    } catch (e) {
      console.log(e);
    }
  },
  components: {
    SideBar,
    TheBody,
    LoginForm,
    ToastMessage,
  },
  methods: {
    loginSuccess(rs) {
      this.toastMessage(Message.loginSuccess)
      localStorage.setItem("token", JSON.stringify(rs));
      this.token = rs;
      this.reload = !this.reload;
    },
    changePage(i) {
      this.page = i;
    },
    logOut() {
      this.token = null;
    },
    toastMessage(val) {
      this.showToastMessage = true;
      this.toastMessageText = val;
      setTimeout(() => {
        this.showToastMessage = false;
      }, 3000);
    },
  },
  data() {
    return {
      page: 1,
      token: null,
      reload: false,
      toastMessageText: "",
      showToastMessage: false,
    };
  },
};
</script>
