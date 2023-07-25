<template>
  <div class="popup">
    <div class="increment-form list-asset-form" v-ctrls="onCtrlS">
      <div class="increment-form-header">
        <p>Chọn tài sản ghi tăng</p>
        <div
          class="increment-form-header-close"
          @click="
            (event) => {
              this.$emit('closeForm');
            }
          "
        >
        <MisaToolTip :content="'Esc'">
          <i class="icon-close"></i>
        </MisaToolTip>
        </div>
      </div>
      <div class="list-asset-search">
        <div class="main-action-search action-filter-search">
          <div class="action-filter-search-icon">
            <i class="icon-search"></i>
          </div>
          <input
            type="text"
            class="main-action-search-input action-filter-search-type"
            placeholder="Tìm kiếm theo mã, tên tài sản"
            v-model="keyword"
            @focus="isTyping = true"
            v-outSide="
              (event) => {
                isTyping = false;
              }
            "
            v-enter="searchIncrement"
          />
        </div>
      </div>
      <div class="increment-form-main-detail-table list-asset-table">
        <div class="increment-data-table-asset-table-header">
          <table>
              <tr>
                <th width="3%" class="align-center align-left">
                  <input
                    type="checkbox"
                    @click="checkAll"
                    :checked="checkBoxHeader"
                    ref="inputCheckboxHeader"
                  />
                </th>
                <th width="5%" class="align-center-number">
                  <MisaToolTip :content="'Số thứ tự'">
                    STT
                  </MisaToolTip>
                </th>
                <th class="align-left">Mã tài sản</th>
                <th class="align-left">Tên tài sản</th>
                <th class="align-left">Bộ phận sử dụng</th>
                <th class="align-right">Nguyên giá</th>
                <th class="align-right">Hao mòn năm</th>
                <th class="align-right padding-right-8px">Giá trị còn lại</th>
              </tr>
          </table>
        </div>
        <div
          class="increment-data-table-asset-main increment-data-table-asset-main-form-table list-asset-table-main"
        >
          <table>
            <tr
              class="data-table-tr"
              v-for="(item, index) in assets"
              :key="index"
              @click="clickItem(item, index + size * (curr - 1))"
              :class="{
                'selected-item': checkedItems.includes(item),
                'focused-item': index == lastItemIndex,
              }"
            >
              <td width="3%" class="align-center">
                <input
                  type="checkbox"
                  :value="item"
                  v-model="checkedItems"
                  @click="
                    (event) => {
                      event.stopPropagation();
                    }
                  "
                />
              </td>
              <td width="5%" class="align-center-number">{{ index + 1 }}</td>
              <td>{{ item.fixed_asset_code }}</td>
              <td>{{ item.fixed_asset_name }}</td>
              <td>{{ item.department_name }}</td>
              <td class="align-right">
                {{ commonJS.formatMoneyN(item.cost) }}
              </td>
              <td class="align-right">
                {{
                  commonJS.formatMoneyN(
                    (item.cost * item.depreciation_rate) / 100
                  )
                }}
              </td>
              <td class="align-right padding-right-8px">
                {{
                  commonJS.formatMoneyN(
                    item.cost * (1 - item.depreciation_rate / 100)
                  )
                }}
              </td>
            </tr>
            <ProgressBar v-if="showProgressBar"></ProgressBar>
          </table>
        </div>
        <PageNumber
          @getFilterRecords="getFilterRecords"
          :totalRecords="totalRecords"
          :onSearch="onSearch"
        ></PageNumber>
      </div>
      <div class="increment-form-footer">
        <MisaToolTip :content="'Ctrl + S'">
        <button
          class="btn btn-blue increment-form-footer-save"
          @click="onSaveForm"
        >
          Đồng ý
        </button>
        </MisaToolTip>
        <MisaToolTip :content="'Esc'">
        <button
          class="btn btn-no increment-form-footer-cancel"
          @click="
            (event) => {
              this.$emit('closeForm');
            }
          "
        >
          Huỷ
        </button>
        </MisaToolTip>
      </div>
    </div>
  </div>
  <MWarningDefault
    :text="warningMessage"
    v-if="warningShow"
    @closeWarning="warningShow = false"
  ></MWarningDefault>
</template>

<script>
import MisaToolTip from "../MisaToolTip/MisaToolTip.vue";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import PageNumber from "../PageNumber/PageNumber.vue";
import commonJS from "@/helpers/common";
import { getListAssetFilter } from "../../helpers/api";
export default {
  name: "ListAsset",
  props: ["assetsPicked", 'incrementID'],
  components: { PageNumber, ProgressBar, MWarningDefault, MisaToolTip },
  created() {
    this.getFilterAssets(20, 1);
  },
  methods: {
    /**
     * Bấm ctrl + S
     * Author: 01/07/2023
     */
    onCtrlS() {
      event.preventDefault();
      this.onSaveForm();
    },
    /**
     * Tìm kiếm tài sản
     * Author: 01/07/2023
     */
    searchIncrement() {
      if (this.isTyping == true) {
        this.onSearch = !this.onSearch;
      }
    },
    /**
     * Lưu form
     * Author: 01/07/2023
     */
    onSaveForm() {
      this.$emit("onSaveForm", this.checkedItems);
    },
    /**
     * Bấm nút chọn tất cả
     * Author: 01/07/2023
     */
    checkAll() {
      if (this.$refs.inputCheckboxHeader.checked == false) {
        this.checkedItems = commonJS.minusArrayAssets(this.checkedItems, this.assets);
      }
      else {
        for (let i = 0; i < this.assets.length; i++) { 
          if (!commonJS.assetsIncludes(this.checkedItems, this.assets[i])) {
            this.checkedItems.push(this.assets[i]);
          }
        }
      }
    },
    /**
     * Click vào dòng table
     * Author: 01/07/2023
     */
    clickItem(item, index) {
      //Ctrl + click
      if (event.ctrlKey) {
        if (!commonJS.assetsIncludes(this.checkedItems, item)) {
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
          if (!this.checkedItems.includes(this.assets[i]))
            this.checkedItems.push(this.assets[i]);
        }
        this.lastItemIndex = index;
      }
      //Click
      else {
        this.lastItemIndex = index;
      }
    },
    /**
     * Sự kiện chọn trang
     * Author: 01/07/2023
     */
    getFilterRecords(pageSize, currentPage) {
      this.getFilterAssets(pageSize, currentPage);
      this.curr = currentPage;
      this.size = pageSize;
      this.lastItemIndex = 0;
    },
    /**
     * Gọi API phân trang
     * Author: 01/07/2023
     */
    getFilterAssets(pageSize, currentPage) {
      this.showProgressBar = true;
      this.getListID();
      getListAssetFilter(
        this.keyword,
        pageSize,
        currentPage,
        this.stringID,
        this.incrementID,
        (res) => {
          this.assets = res.data.data;
          this.totalRecords = res.data.totalRecord;
          this.showProgressBar = false;
        },
        (error) => {
          this.warningMessage = commonJS.handleError(error);
          this.warningShow = true;
        }
      );
    },
    /**
     * Lấy danh sách ID gửi sang để phân trang
     * Author: 01/07/2023
     */
    getListID() {
      if (this.assetsPicked.length > 0) {
        for (let i = 0; i < this.assetsPicked.length; i++) {
          this.stringID.push(this.assetsPicked[i].fixed_asset_id);
        }
      } else {
        this.stringID = ["00000000-0000-0000-0000-000000000000"];
      }
    },
  },
  data() {
    return {
      assets: [],
      keyword: "",
      totalRecords: null,
      showProgressBar: false,
      checkedItems: [],
      onSearch: false,
      isTyping: false,
      stringID: [],
      curr: 1,
      size: 20,
      lastItemIndex: 0,
      warningMessage: "",
      warningShow: false,
    };
  },
  watch: {
    keyword(val) {
      if (val == "") {
        this.onSearch = !this.onSearch;
      }
    },
  },
  computed: {
    //Theo dõi nút checkall
    checkBoxHeader() {
      if (commonJS.minusArrayAssets(this.assets, this.checkedItems).length == 0 && this.checkedItems.length > 0 && this.assets.length > 0) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style>
@import url("./ListAsset.css");
</style>
