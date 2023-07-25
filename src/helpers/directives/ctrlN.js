import Enums from "../enum";
const clickCtrlN = {
  beforeMount: (el, binding) => {
    el.clickCtrlNEvent = (event) => {
      if (
        event.ctrlKey &&
        event.keyCode == Enums.KeyBoard.N
      ) {
        binding.value();
      }
    };
    document.addEventListener("keydown", el.clickCtrlNEvent);
  },
  unmounted: (el) => {
    document.removeEventListener("keydown", el.clickCtrlNEvent);
  },
};
export default clickCtrlN;
