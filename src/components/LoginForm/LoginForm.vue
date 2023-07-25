<template>
  <div class="login-form" v-enter="onSaveForm">
    <div class="login-form-wrapper">
      <div class="login-form-error-msg">
        <p v-if="showError">{{ errorMessage }}</p>
      </div>
      <div class="login-form-main">
        <div class="login-form-left"></div>
        <div class="login-form-right">
          <div class="login-form-right-wrapper">
            <div class="login-form-right-header"></div>
            <p class="login-form-right-title">
              {{ firstTitle }}<span>{{ secondTitle }}</span>
            </p>
            <div
              class="login-form-right-input"
              :class="{
                'input-border-blue': inputBorderBlue,
                'input-border-red': inputBorderRed,
              }"
              v-outSide="
                (event) => {
                  inputBorderBlue = false;
                }
              "
            >
              <input
                type="text"
                @focus="
                  inputBorderBlue = true;
                  inputBorderRed = false;
                "
                placeholder="Username, email hoặc số điện thoại"
                v-model="user.user_name"
              />
            </div>
            <div
              class="login-form-right-input"
              :class="{
                'input-border-blue': inputPassBorderBlue,
                'input-border-red': inputPassBorderRed,
              }"
              v-if="login"
              v-outSide="
                (event) => {
                  inputPassBorderBlue = false;
                }
              "
            >
              <input
                ref="passwordInput"
                type="password"
                placeholder="Nhập mật khẩu"
                @focus="
                  inputPassBorderBlue = true;
                  inputPassBorderRed = false;
                "
                v-model="user.user_password"
              />
              <div
                class="input-password-icon"
                v-if="passwordIcon"
                @click="passwordIcon = false"
              >
                <i class="icon-eye"></i>
              </div>
              <div
                class="input-password-icon"
                v-if="!passwordIcon"
                @click="passwordIcon = true"
              >
                <i class="icon-none-eye"></i>
              </div>
            </div>

            <div
              class="btn btn-blue login-form-right-button"
              @click="onSaveForm"
            >
              {{ buttonText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="login-form-footer">Copyright © 2020 MISA JSC</p>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "LoginForm",
  methods: {
    generateCode(length) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    },
    /**
     * Hiển thị lỗi
     * Author: TMNghia 01/07/2023
     */
    showErrorMessage() {
      this.showError = true;
      setTimeout(() => (this.showError = false), 3000);
    },
    /**
     * Đăng nhập
     * Author: TMNghia 01/07/2023
     */
    onSaveForm() {
      if (
        this.user.user_name == "" ||
        this.user.user_name == undefined ||
        this.user.user_password == "" ||
        this.user.user_password == undefined
      ) {
        this.inputBorderRed = true;
        this.errorMessage = "Vui lòng nhập đủ thông tin đăng nhập";
        this.showErrorMessage();
      } else {
        axios
          .post("https://localhost:44375/api/Auth", {
            user_name: this.user.user_name,
            user_password: this.user.user_password,
          })
          .then((res) => this.$emit("loginSuccess", res.data))
          .catch(res => {
            if (res.response.status == 404) {
              this.errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
              this.showErrorMessage();
            }
          });
      }
    },
  },
  watch: {
    passwordIcon(val) {
      if (val == true) {
        this.$refs.passwordInput.type = "text";
      } else {
        this.$refs.passwordInput.type = "password";
      }
    },
  },

  data() {
    return {
      errorMessage: "",
      randomCode: "",
      firstTitle: "Đăng nhập để làm việc với ",
      secondTitle: "MISA QLTS",
      passwordIcon: false,
      buttonText: "Đăng nhập",
      changeAction: "Quên mật khẩu?",
      inputBorderBlue: false,
      inputBorderRed: false,
      inputPassBorderBlue: false,
      inputPassBorderRed: false,
      inputCodeBorderBlue: false,
      inputCodeBorderRed: false,
      user: {},
      login: true,
      showError: false,
      code: "",
    };
  },
};
</script>
<style>
@import url(./LoginForm.css);
</style>
