import { createApp } from "vue";
import App from "./App.vue";
import commonJS from "./helpers/common.js";
import Enums from "./helpers/enum.js";
import clickOutside from "./helpers/directives/clickOutside.js"; 
import clickEsc from "./helpers/directives/esc.js";
import pressEnter from "./helpers/directives/pressEnter.js";
import clickCtrlS from "./helpers/directives/ctrlS";
import pressTab from "./helpers/directives/pressTab";
import clickCtrlN from "./helpers/directives/ctrlN";
import clickCtrlD from "./helpers/directives/ctrlD";

const app = createApp(App);

app.directive('outSide', clickOutside);
app.directive('esc', clickEsc);
app.directive('enter', pressEnter);
app.directive('ctrls', clickCtrlS);
app.directive('tab', pressTab);
app.directive('ctrln', clickCtrlN);
app.directive('ctrld', clickCtrlD);
app.config.globalProperties.enums = Enums;
app.config.globalProperties.commonJS = commonJS;
app.mount("#app");