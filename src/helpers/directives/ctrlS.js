import Enums from "../enum";
const clickCtrlS = {
  beforeMount: (el, binding) => {
    el.clickCtrlSEvent = (event) => {
      if (
        event.ctrlKey &&
        event.keyCode == Enums.KeyBoard.S
      ) {
        binding.value();
      }
    };
    document.addEventListener("keydown", el.clickCtrlSEvent);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.clickCtrlSEvent);
  },
};
export default clickCtrlS;
