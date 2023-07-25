<template>
  <div class="app-container">
    <MainApp></MainApp>
  </div>
</template>

<script>
import MainApp from './components/MainApp/MainApp.vue'

export default {
  name: "App",
  components: {
    MainApp,
  },
};


</script>

<style>
.app-container{
    display: flex;
}
</style>
