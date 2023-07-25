import Enums from "../enum";
const pressTab = {
    beforeMount: (el, binding) => {
        el.pressTabEvent = event => {
            if (event.keyCode == Enums.KeyBoard.Tab) {
                binding.value();
            }
        };
        document.addEventListener("keydown", el.pressTabEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.pressTabEvent);
    },
}
export default pressTab;