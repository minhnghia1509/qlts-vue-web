import Enums from "../enum";
const pressEnter = {
    beforeMount: (el, binding) => {
        el.pressEnterEvent = event => {
            if (event.keyCode == Enums.KeyBoard.Enter) {
                binding.value();
            }
        };
        document.addEventListener("keydown", el.pressEnterEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.pressEnterEvent);
    },
}
export default pressEnter;