<template>
  <div class="wrapper-progress-bar">
    <div class="loader-progress-bar"></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
};
</script>

<style>
.wrapper-progress-bar {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-color: #c0c0c0aa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999999;
}

.loader-progress-bar {
  border: 4px solid rgba(55, 55, 248, 0.688); /* Light grey */
  border-top: 4px solid #f3f3f305; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
