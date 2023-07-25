import Enums from "../enum";
const clickCtrlD = {
  beforeMount: (el, binding) => {
    el.clickCtrlDEvent = (event) => {
      if (
        event.ctrlKey &&
        event.keyCode == Enums.KeyBoard.D
      ) {
        binding.value();
      }
    };
    document.addEventListener("keydown", el.clickCtrlDEvent);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.clickCtrlDEvent);
  },
};
export default clickCtrlD;