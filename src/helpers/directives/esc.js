import Enums from "../enum";
const clickEsc = {
    beforeMount: (el, binding) => {
        el.clickEscEvent = event => {
            if (event.keyCode == Enums.KeyBoard.Escape) {
                binding.value();
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
}
export default clickEsc;