<template>
  <div
    class="ms-tooltip"
    @mousemove="onMouseOver"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
  >
    <span
      v-show="content != ''"
      v-html="content"
      class="ms-tooltip__text"
      ref="tooltip"
      :class="isShow ? 'show' : ''"
    >
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Number],
      default: "",
    },
    top: {
      type: Number,
      default: 10,
    },
    left: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      isShow: false,
      isMouseDown: false,
    };
  },
  methods: {
    /**
     * @description: Thực hiện ẩn tooltip khi hover ra và set lại giá trị isMouseDown = false để cho phép hiển thị tooltip khi hover vào
     * @author: TMNghia 20/05/2023
     */
    onMouseLeave() {
      this.isShow = false;
      this.isMouseDown = false;
    },
    /**
     * @description: Thực hiện ẩn tooltip khi click vào và set lại giá trị isMouseDown = true để không cho phép hiển thị tooltip khi hover vào
     * @author: TMNghia 20/05/2023
     */
    onMouseDown() {
      this.isShow = false;
      this.isMouseDown = true;
    },

    /**
     * @description: hiển thị tooltip khi hover vào
     * @author: TMNghia 20/05/2023
     */
    onMouseOver(event) {
      if (!this.isMouseDown) {
        // nếu isMouseDown là false thì  cho phép hiển thị tooltip
        this.isShow = true;
        // lấy tọa độ của chuột
        const { clientX, clientY } = event;
        const tooltip = this.$refs.tooltip;
        if (tooltip) {
          // tạo tooltip ở dưới vị trí của chuột
          tooltip.style.top = clientY + this.top + "px";
          tooltip.style.left = clientX + this.left + "px";
          // nếu tooltip bị tràn ra ngoài màn hình thì đưa về trở về vị trí ban đầu
          if (tooltip.getBoundingClientRect().right > window.innerWidth) {
            tooltip.style.left = clientX - tooltip.offsetWidth + "px";
          }
          if (tooltip.getBoundingClientRect().bottom > window.innerHeight) {
            tooltip.style.top = clientY - tooltip.offsetHeight + "px";
          }
        }
      }
    },
  },
};
</script>
<style scoped>
.ms-tooltip__text {
  z-index: 9999;
  display: none;
  position: fixed;
  pointer-events: none;
  padding: 2px 4px;
  opacity: 0;
  line-height: 1.5;
  font-weight: 400;
  font-size: 14px;
  font-family: inherit;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.219);
  border: 1px solid #1aa5c83b;
  background-color: #4f4f4f;
  width: fit-content;
  display: flex;
  text-align: left;
  flex-direction: column;
  row-gap: 8px;
  white-space: nowrap;
  color: white;
  border-radius: 2px;
}

.ms-tooltip__text.show {
  display: block;
  opacity: 0.9;
}

</style>
