<template>
  <div
    class="mcombobox"
    v-outSide="
      (event) => {
        showList = false;
      }
    "
    @click="showList = !showList"
    @keydown="inputOnKeyDown"
  >
    <input
      type="text"
      readonly="true"
      :placeholder="placeholder"
      v-model="comboboxValue"
      @focus="inputRed = false"
      @blur="blurCombobox"
      :class="{'input-red':inputRed, 'input-blue': !inputRed}"
    />
    <div class="mcombobox-icon">
      <i class="icon-down"></i>
    </div>
    <ul class="mcombobox-list-item" v-if="showList">
      <li
        v-for="(item, index) in listItem"
        :key="index"
        @mousedown="clickItem(item, index)"
        :class="{ 'mcombobox-item-selected': index == indexSelected }"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script>
import Enums from "../../helpers/enum.js";
export default {
  name: "MCombobox",
  props: ["listItem", "placeholder", 'value', 'indexCombobox', 'error', 'flag', 'index'],
  created() {
    this.comboboxValue = this.value;
    this.inputRed = this.error;
  },
  methods: {
    blurCombobox() {
      this.showList = false;
      if (this.comboboxValue) {
        this.inputRed = false;
      } else {
        this.inputRed = true;
      }
      this.$emit("changeStatus", this.inputRed, this.index);
    },
    clickItem(item, index) {
      event.stopPropagation();
      this.$emit("changeValue", item, this.indexCombobox);
      this.showList = false;
      this.indexSelected = index;
      this.inputRed = false;
    },
    inputOnKeyDown() {
      console.log(1);
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.ArrowDown:
          if (this.indexSelected == null) {
            this.indexSelected = 0;
          } else if (this.indexSelected == this.listItem.length - 1) {
            this.indexSelected = 0;
          } else {
            this.indexSelected++;
          }
          break;
        case Enums.KeyBoard.ArrowUp:
          if (this.indexSelected == null) {
            this.indexSelected = this.listItem.length - 1;
          } else if (this.indexSelected == 0) {
            this.indexSelected = this.listItem.length - 1;
          } else {
            this.indexSelected--;
          }
          break;
        case Enums.KeyBoard.Enter:
          if (this.indexSelected == null) {
            this.showList = true;
          } else {
            this.clickItem(
              this.listItem[this.indexSelected],
              this.indexSelected
            );
          }
          break;
        default:
          break;
      }
      // }
    },
  },
  data() {
    return {
      comboboxValue: "",
      showList: false,
      indexSelected: null,
      inputRed: false,
    };
  },
  watch: {
    value(val) {
      console.log(1);
      this.comboboxValue = val;
    },
    error(val) {
      this.inputRed = val;
    },
    flag() {
      this.blurCombobox();
    },
  },
};
</script>
<style>
@import url("./MCombobox.css");
</style>
