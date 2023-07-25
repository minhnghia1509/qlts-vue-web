<template>
  <div class="increment-data-table">
    <div class="increment-data-table-header">
      <table>
        <thead>
          <tr class="increment-data-table-header-tr">
            <th class="item-align-center" width="5%">
              <input
              ref="inputCheckboxHeader"
                type="checkbox"
                @click="checkAll"
                :checked="checkBoxHeader"
              />
            </th>
            <th class="item-align-center" width="5%">
              <MisaToolTip :content="'Số thứ tự'">STT</MisaToolTip>
            </th>
            <th width="10%">Số chứng từ</th>
            <th width="10%" class="item-align-center">Ngày chứng từ</th>
            <th width="10%" class="item-align-center">Ngày ghi tăng</th>
            <th width="10%" class="align-right">Tổng nguyên giá</th>
            <th class="padding-left-16px">Nội dung</th>
            <th width="10%"></th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="increment-data-table-main" ref="dataTableMain">
      <table>
        <tbody>
          <tr
            class="increment-data-table-body-tr"
            v-for="(item, index) in increments"
            :key="index"
            @click="clickItem(item, index)"
            @dblclick="showFormUpdate(item)"
            :class="{'selected-item':checkedItems.includes(item), 'focused-item':index == lastItemIndex}"
            @contextmenu="onClickContextMenu(item, index)"
          >
            <td class="item-align-center" width="5%">
              <input
                type="checkbox"
                :value="item"
                v-model="checkedItems"
                @click="clickCheckboxItem"
                @blur="clickOutSideTable"
              />
            </td>
            <td class="item-align-center" width="5%">{{ index + 1 }}</td>
            <td width="10%"><MisaToolTip :content="item.fixed_asset_increment_code"><p class="overflow-ellipsis">{{ item.fixed_asset_increment_code }}</p></MisaToolTip></td>
            <td width="10%" class="item-align-center">
              {{ commonJS.formatDate(item.production_year) }}
            </td>
            <td width="10%" class="item-align-center">
              {{ commonJS.formatDate(item.increment_date) }}
            </td>
            <td width="10%" class="align-right">{{ commonJS.formatMoneyN(item.total) }}</td>
            <td class="padding-left-16px">
              <MisaToolTip :content="item.description"><p class="overflow-ellipsis">{{
                item.description
              }}</p></MisaToolTip>
            </td>
            <td width="5%">
              <div class="increment-data-table-tr-action">
                <div class="increment-data-table-tr-action-pen" @click="showFormUpdate(item)">
                  <MisaToolTip :content="'Sửa'">
                    <i class="icon-pen"></i>
                  </MisaToolTip>
                </div>
                <div
                  class="increment-data-table-tr-action-delete"
                  @click="clickDelete(item)"
                >
                <MisaToolTip :content="'Xoá'">
                  <i class="icon-delete"></i>
                  </MisaToolTip>
                </div>
              </div>
            </td>
          </tr>
          <ul
            class="data-tables-item-menu-context"
            v-show="showContextMenu"
            ref="tablesContextMenu"
            v-outSide="disableContextMenu"
          >
            <li @click="menuContextAdd"><i class="icon-add"></i>Thêm mới</li>
            <li @click="menuContextEdit"><i class="icon-pen"></i>Sửa</li>
            <li @click="menuContextDelete">
              <i class="icon-delete"></i>Xoá
            </li>
          </ul>
        </tbody>
      </table>
      <ProgressBar v-if="showProgressBar"></ProgressBar>
    </div>
    <div class="increment-data-table-footer">
      <table>
        <tr>
          <td width="40%" class="align-right"></td>
          <td width="10%" class="align-right padding-right-7px text-bold" @click="clickChecked">
            {{ commonJS.formatMoneyN(totalCost) }}
          </td>
          <td class="padding-left-16px"></td>
          <td></td>
        </tr>
      </table>
      <PageNumber
        @getFilterRecords="getFilterRecords"
        :totalRecords="totalRecords"
        :onSearch="onSearch"
      ></PageNumber>
    </div>
  </div>
  <IncrementForm
  @updateSuccess="updateSuccess"
    v-if="showIncrementForm"
    :formMode="formMode"
    :incrementPicked="incrementPicked"
    @closeForm="
      (event) => {
        this.showIncrementForm = false;
      }
    "
    :token="token"
  ></IncrementForm>
  <MWarningDefault v-if="showMWarningDefault" :text="warningMessage" @closeWarning="showMWarningDefault = false"></MWarningDefault>
</template>
<script>
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import MisaToolTip from "../MisaToolTip/MisaToolTip.vue";
import IncrementForm from "../IncrementForm/IncrementForm.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import PageNumber from "../PageNumber/PageNumber.vue";
import Enums from "@/helpers/enum";
import commonJS from "@/helpers/common";
import { getIncrements } from "../../helpers/api.js";
export default {
  components: {
    PageNumber,
    ProgressBar,
    IncrementForm,
    MisaToolTip,
    MWarningDefault,
  },
  mounted() {},
  name: "IncrementTable",
  props: ["dataTableMainHeight", "token", "keyword", "onSearch", "reloadTable", "reload"],
  created() {
    this.showProgressBar = true;
    this.getFilterIncrements(20, 1);
  },
  methods: {
    menuContextDelete() {
      this.clickDelete(this.incrementRightClick);
    },
    menuContextEdit() {
      this.showFormUpdate(this.incrementRightClick)
    },
    menuContextAdd() {
      this.$emit('menuContextAdd');
    },
    /**
     * Sửa thành công
     * Author: TMNghia 01/07/2023
     */
    updateSuccess() {
      this.checkedItems = [];
      this.showIncrementForm = false;
      this.getFilterIncrements(this.size, this.curr);
      this.$emit("pickIncrements", this.increments[0].fixed_asset_increment_id);
      this.$emit("updateSuccess");
    },
    disableContextMenu() {
      this.showContextMenu = false;
    },
        /**
     * Hàm xử lý hiện menucontext
     */
     onClickContextMenu(item, index) {
       event.preventDefault();
       this.showContextMenu = true;
       this.lastItemIndex = index;
       this.$emit("pickIncrements", item.fixed_asset_increment_id);
      this.$refs.tablesContextMenu.style.top = (20 + index*40.8) + "px";
      this.$refs.tablesContextMenu.style.left = (event.pageX - 80) + "px";
      this.incrementRightClick = item;
    },
    /**
     * Click ra ngoài table
     * Author: TMNghia 01/07/2023
     */
    clickOutSideTable() {
      this.$emit("getCheckedItems", this.checkedItems);
    },
    /**
     * Chọn checkbox
     * Author: TMNghia 01/07/2023
     */
    clickCheckboxItem() {
      event.stopPropagation();
    },
    /**
     * Click xoá
     * Author: TMNghia 01/07/2023
     */
    clickDelete(item) {
      event.stopPropagation();
      this.$emit("deleteItem", item);
    },
    /**
     * Hiển thị form sửa
     * Author: TMNghia 01/07/2023
     */
    showFormUpdate(item) {
      this.formMode = Enums.FormMode.Update;
      this.incrementPicked = item;
      this.showIncrementForm = true;
    },
    /**
     * Phân trang chứng từ
     * Author: TMNghia 01/07/2023
     */
    getFilterRecords(pageSize, currentPage) {
      this.getFilterIncrements(pageSize, currentPage);
      this.curr = currentPage;
      this.size = pageSize;
      this.lastItemIndex = 0;
      // if (commonJS.minusArrayIncrements(this.increments, this.checkedItems).length == 0 && this.checkedItems.length > 0) {
      //     this.selectAll = true;
      //   } else {
      //     this.selectAll = false;
      //   }
    },
    /**
     * Phân trang chứng từ
     * Author: TMNghia 01/07/2023
     */
    getFilterIncrements(pageSize, currentPage) {
      this.showProgressBar = true;
      //Gọi API phân trang
      getIncrements(this.keyword, pageSize, currentPage, (res) => {
        this.increments = res.data.data;
        //Hiển thị những tài sản của chứng từ đã chọn
        this.$emit("pickIncrements", this.increments[this.lastItemIndex].fixed_asset_increment_id);
        this.totalRecords = res.data.totalRecord;
        this.showProgressBar = false;
      },         (error) => {
          this.showProgressBar = false;
          this.warningMessage = commonJS.handleError(error);
          this.showMWarningDefault = true;
        });
    },
    /**
     * Checkbox all
     * Author: TMNghia 01/07/2023
     */
    checkAll() {
      if (this.$refs.inputCheckboxHeader.checked == false) {
        this.checkedItems = commonJS.minusArrayIncrements(this.checkedItems, this.increments);
      }
      else {
        for (let i = 0; i < this.increments.length; i++) { 
          if (!commonJS.incrementIncludes(this.checkedItems, this.increments[i])) {
            this.checkedItems.push(this.increments[i]);
          }
        }
      }
      this.$emit("getCheckedItems", this.checkedItems);
    },
    /**
     * Click dòng trên table
     * Author: TMNghia 01/07/2023
     */
    clickItem(item, index) {
      event.stopPropagation();
      this.showContextMenu = false;
      //Ctrl + click
      if (event.ctrlKey) {
        if (!commonJS.incrementIncludes(this.checkedItems, item)) {
          this.checkedItems.push(item);
        }
        this.lastItemIndex = index;
      }
      //Shift + click
      else if (event.shiftKey) {
        event.preventDefault();
        let max = this.lastItemIndex > index ? this.lastItemIndex : index;
        let min = this.lastItemIndex < index ? this.lastItemIndex : index;
        for (let i = min; i <= max; i++) {
          if(!this.checkedItems.includes(this.increments[i]))
          this.checkedItems.push(this.increments[i]);
        }
        this.lastItemIndex = index;
      }
      //Click
      else {
        this.lastItemIndex = index;
      }
      this.$emit("getCheckedItems", this.checkedItems);
      this.$emit("pickIncrements", item.fixed_asset_increment_id);
    },
  },

  data() {
    return {
      increments: [],
      showProgressBar: false,
      checkedItems: [],
      isCheckedAll: false,
      totalRecords: null,
      isTyping: false,
      showIncrementForm: false,
      formMode: null,
      cancel: null,
      incrementPicked: {},
      pickedItems: [],
      curr: 1,
      size: 20,
      currList: [],
      lastItemIndex: 0,
      selectAll: false,
      flagPickIncrement: false,
      warningMessage: '',
      showMWarningDefault: false,
      incrementRightClick: {},
      showContextMenu: false,
    };
  },

  computed: {
    //Theo dõi nút checkall
    checkBoxHeader() {
      if (commonJS.minusArrayIncrements(this.increments, this.checkedItems).length == 0 && this.checkedItems.length > 0 && this.increments.length > 0) {
        return true;
      }
      return false;
    },
    //Tổng nguyên giá
    totalCost() {
      let total = 0;
      this.increments.map((increment) => (total += increment.total));
      return total;
    },
  },

  watch: {
    //Bấm chọn chứng từ
    flagPickIncrement() {
      this.$emit("getCheckedItems", this.checkedItems);
    },
    //Theo dõi thay đổi chiều cao table
    dataTableMainHeight(val) {
      this.$refs.dataTableMain.style.height = val;
    },
    //Reload table hiện tại
    reloadTable() {
      this.checkedItems = [];
      this.lastItemIndex = 0;
      this.getFilterIncrements(this.size, this.curr);
    },
    //Reload table về ban đầu
    reload() {
      this.lastItemIndex = 0;
      this.getFilterIncrements(20, 1);
    },
  },
};
</script>
<style>
.increment-data-table-main {
  position: relative;
}
</style>
