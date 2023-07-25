<template>
  <div class="data-tables-footer">
    <div class="data-tables-footer-total">
      Tổng số:
      <span class="text-bold">{{ totalRecords }}</span>
      bản ghi
    </div>
    <div
      class="data-tables-footer-select"
      v-outSide="
        (event) => {
          showPageSize = false;
        }
      "
      @click="showPageSize = true"
    >
      <input
        v-model="pageSize"
        class="data-tables-footer-page-size"
        readonly="true"
      />

      <MisaToolTipVue :content="'Chọn kích cỡ trang'">
        <div class="data-tables-footer-page-size-icon">
          <i class="icon-down"></i>
        </div>
      </MisaToolTipVue>
      <ul class="list-page-size" v-if="showPageSize">
        <li
          class="page-size-item"
          :class="{'page-size-item-active': activeSize == item}"
          v-for="(item, index) in listPageSize"
          :key="index"
          @click="
            (event) => {
              pageSize = item;
              showPageSize = false;
              currentPage = 1;
              activeSize = item;
              this.$emit('getFilterRecords', this.pageSize, this.currentPage);
            }
          "
        >
          <p>{{item}}</p>
        </li>
      </ul>
    </div>
    <ul class="data-tables-footer-page-number">
      <MisaToolTipVue :content="'Trang trước'">
      <li
      class="data-tables-footer-page-number-item data-tables-footer-page-number-item-first"
      :class="{'cursor-not-allowed':currentPage == 1 || pages.length == 0}"
      @click="changePage('prev')"
      >
        <i class="icon-left"></i>
      </li>
    </MisaToolTipVue>
      <li
        v-for="(item, index) in pages"
        :key="index"
        class="data-tables-footer-page-number-item"
        :class="{
          'current-page': item == currentPage,
          'cursor-not-allowed': item == '...'
        }"
        @click="changePage(item)"
      >
        {{ item }}
      </li>
      <MisaToolTipVue :content="'Trang kế tiếp'">
      <li
      :class="{'cursor-not-allowed':currentPage == totalPage || pages.length == 0}"
      class="data-tables-footer-page-number-item data-tables-footer-page-number-item-last"
      @click="changePage('next')"
      >
          <i class="icon-right"></i>
        </li>
      </MisaToolTipVue>
    </ul>
  </div>
</template>
<script>
import commonJS from '@/helpers/common.js';
import MisaToolTipVue from '../MisaToolTip/MisaToolTip.vue';
export default {
  name: "PageNumber",
  components: {MisaToolTipVue},
  props: ["totalRecords", "onSearch"],
  created() {
    console.log(commonJS.formatMoney(1));
  },
  methods: {
    show() {
      console.log(commonJS);
    },
    changePage(value) {
      if (value == "prev") {
        if (this.currentPage == 1) {
          return;
        } else {
          this.currentPage--;
        }
      } else if (value == "next") {
        if (this.currentPage == this.totalPage) {
          return;
        } else {
          this.currentPage++;
        }
      } else if (value == "...") {
        return;
      } else {
        this.currentPage = value;
      }
      this.$emit("getFilterRecords", this.pageSize, this.currentPage);
    },
  },
  computed: {
    /**
     * Tính số lượng trang
     * Author: TMNghia 25/4/2023
     */
    totalPage() {
      return Math.ceil(this.totalRecords / this.pageSize);
    },
    /**
     * Logic hiển thị số trang
     * Author: TMNghia 25/4/2023
     */
    pages() {
      let pages = [];
      for (let i = 1; i <= this.totalPage; i++) {
        if (
          i == 1 ||
          i == this.totalPage ||
          (i <= this.currentPage + 2 && i >= this.currentPage - 2)
        ) {
          pages.push(i);
        } else if (i == this.currentPage + 3 || i == this.currentPage - 3) {
          pages.push("...");
        }
      }
      return pages;
    },
  },

  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      listPageSize: [10, 20, 30, 40, 50],
      showPageSize: false,
      activeSize: 0,
    };
  },
  watch: {
    onSearch() {
      this.currentPage = 1;
      this.$emit("getFilterRecords", this.pageSize, this.currentPage);
    },
  },
};
</script>
<style>
@import url("./PageNumber.css");
</style>
