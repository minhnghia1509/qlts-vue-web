<template>
  <div class="popup">
    <div class="increment-form" v-ctrls="onCtrlS" v-esc="onEsc">
      <div class="increment-form-header">
        <p>{{ formTitle }}</p>
        <div class="increment-form-header-close" @click="onCloseFormIncrement">
          <MisaToolTip :content="'Esc'">
            <i class="icon-close"></i>
          </MisaToolTip>
        </div>
      </div>
      <div class="increment-form-main">
        <div class="increment-form-main-infor">
          <p>Thông tin chứng từ</p>
          <div class="increment-form-main-infor-inputs">
            <div class="increment-form-main-infor-inputs-row">
              <div class="increment-form-main-infor-inputs-item">
                <p class="increment-form-main-infor-inputs-item-title">
                  Mã chứng từ <span>*</span>
                </p>
                <input
                  maxlength="50"
                  type="text"
                  class="increment-form-main-infor-input"
                  :class="{
                    'input-blue': !errors[0].status,
                    'input-red': errors[0].status,
                  }"
                  ref="incrementCodeInput"
                  v-model="increment.fixed_asset_increment_code"
                  @blur="blurInput(increment.fixed_asset_increment_code, 0)"
                  tabindex="11"
                  @input="changedValue"
                />
                <p
                  class="increment-form-main-infor-inputs-error"
                  v-if="errors[0].status"
                >
                  {{ errors[0].value }}
                </p>
              </div>
              <div class="increment-form-main-infor-inputs-item">
                <p class="increment-form-main-infor-inputs-item-title">
                  Ngày bắt đầu sử dụng <span>*</span>
                </p>
                <input
                  type="date"
                  placeholder="dd/MM/yyyy"
                  ref="productionYearInput"
                  class="increment-form-main-infor-input"
                  :class="{
                    'input-blue': !errors[1].status,
                    'input-red': errors[1].status,
                  }"
                  v-model="increment.production_year"
                  @blur="blurInput(increment.production_year, 1)"
                  tabindex="12"
                  @input="changedValue"
                />
                <div
                  class="increment-form-main-infor-input-icon"
                  @click="
                    (event) => {
                      this.$refs.productionYearInput.showPicker();
                    }
                  "
                >
                  <i class="icon-date"></i>
                </div>
                <p
                  class="increment-form-main-infor-inputs-error"
                  v-if="errors[1].status"
                >
                  {{ errors[1].value }}
                </p>
              </div>
              <div class="increment-form-main-infor-inputs-item">
                <p class="increment-form-main-infor-inputs-item-title">
                  Ngày ghi tăng <span>*</span>
                </p>
                <input
                  type="date"
                  placeholder="dd/MM/yyyy"
                  ref="incrementDateInput"
                  class="increment-form-main-infor-input"
                  :class="{
                    'input-blue': !errors[2].status,
                    'input-red': errors[2].status,
                  }"
                  @blur="blurInput(increment.increment_date, 2)"
                  v-model="increment.increment_date"
                  tabindex="13"
                  @input="changedValue"
                />
                <div
                  class="increment-form-main-infor-input-icon"
                  @click="
                    (event) => {
                      this.$refs.incrementDateInput.showPicker();
                    }
                  "
                >
                  <i class="icon-date"></i>
                </div>
                <p
                  class="increment-form-main-infor-inputs-error"
                  v-if="errors[2].status"
                >
                  {{ errors[2].value }}
                </p>
              </div>
            </div>
            <div
              class="increment-form-main-infor-inputs-row increment-form-main-infor-inputs-notes"
            >
              <div class="increment-form-main-infor-inputs-item">
                <p class="increment-form-main-infor-inputs-item-title">
                  Ghi chú
                </p>
                <input
                  type="text"
                  class="increment-form-main-infor-input input-blue"
                  v-model="increment.description"
                  tabindex="14"
                  @input="changedValue"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="increment-form-main-detail">
          <p>Thông tin chi tiết</p>
          <div class="increment-form-main-detail-header">
            <div class="main-action-search action-filter-search">
              <div class="action-filter-search-icon">
                <i class="icon-search"></i>
              </div>
              <input
                type="text"
                class="main-action-search-input action-filter-search-type"
                placeholder="Tìm kiếm theo mã, tên tài sản"
                v-enter="onEnter"
                v-model="keyword"
                @focus="isTyping = true"
                v-outSide="
                  (event) => {
                    isTyping = false;
                  }
                "
                tabindex="15"
              />
            </div>
            <button
              class="btn btn-no increment-form-main-detail-header-btn"
              @click="showListAsset = true"
              tabindex="16"
              ref="openListAsset"
            >
              Chọn tài sản
            </button>
          </div>
          <div class="increment-form-main-detail-table">
            <div class="increment-data-table-asset-table-header">
              <table>
                <thead>
                  <tr>
                    <th width="5%" class="align-center-number">
                      <MisaToolTip :content="'Số thứ tự'"> STT </MisaToolTip>
                    </th>
                    <th>Mã tài sản</th>
                    <th>Tên tài sản</th>
                    <th>Bộ phận sử dụng</th>
                    <th class="align-right">Nguyên giá</th>
                    <th class="align-right">Hao mòn năm</th>
                    <th class="align-right padding-right-8px">
                      Giá trị còn lại
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div
              class="increment-data-table-asset-main increment-data-table-asset-main-form-table"
            >
              <table>
                <tr
                  class="data-table-tr increment-form-data-table-action-tr"
                  v-for="(item, index) in listAssets"
                  @dblclick="openBudgetForm(item)"
                  :key="index"
                >
                  <td width="5%" class="align-center-number">
                    {{ index + 1 }}
                  </td>
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
                  <td
                    class="align-right padding-right-8px increment-form-data-table-action-cell"
                  >
                    {{
                      commonJS.formatMoneyN(
                        item.cost * (1 - item.depreciation_rate / 100)
                      )
                    }}
                    <div
                      class="increment-data-table-tr-action increment-form-data-table-action"
                    >
                      <div
                        class="increment-data-table-tr-action-pen"
                        @click="openBudgetForm(item)"
                      >
                        <MisaToolTip :content="'Sửa tài sản'">
                          <i class="icon-pen"></i>
                        </MisaToolTip>
                      </div>
                      <div
                        class="increment-data-table-tr-action-delete"
                        @click="removeAsset(item, index)"
                        @dblclick="(event)=>{event.stopPropagation()}"
                      >
                        <MisaToolTip :content="'Xoá tài sản'">
                          <i class="icon-delete"></i>
                        </MisaToolTip>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              <ProgressBar v-if="showProgressBarTable"></ProgressBar>
            </div>
            
            <div class="increment-data-table-asset-main">
              <table>
                <tr class="increment-data-table-asset-main-footer">
                  <td width="5%"></td>
                  <td colspan="3"></td>
                  <td class="align-right">
                    {{ commonJS.formatMoneyN(totalCost) }}
                  </td>
                  <td class="align-right">
                    {{ commonJS.formatMoneyN(totalDep) }}
                  </td>
                  <td class="align-right padding-right-8px">
                    {{ commonJS.formatMoneyN(totalCost - totalDep) }}
                  </td>
                </tr>
              </table>
            </div>
            <PageNumber
              @getFilterRecords="getFilterRecords"
              :totalRecords="totalRecords"
            ></PageNumber>
          </div>
        </div>
      </div>
      <div class="increment-form-footer">
        <MisaToolTip :content="'Ctrl + S'"><button
          class="btn btn-blue increment-form-footer-save"
          @click="onSaveFormIncrement"
          tabindex="17"
          @focus="btnSaveFocused = true"
          @blur="btnSaveFocused = false"
        >
          Lưu
        </button></MisaToolTip>
        <MisaToolTip :content="'Esc'">
        <button
          class="btn btn-no increment-form-footer-cancel"
          @click="onCloseFormIncrement"
          tabindex="18"
          @blur="btnCancelFocused = false"
          @focus="btnCancelFocused = true"
          @keydown="lastItemTab"
        >
          Huỷ
        </button>
      </MisaToolTip>
      </div>
    </div>
    <ProgressBar v-if="showProgressBar"></ProgressBar>
  </div>
  <ListAsset
    v-if="showListAsset"
    @closeForm="
      (event) => {
        this.showListAsset = false;
      }
    "
    @onSaveForm="IncrementListAsset"
    :token="token"
    :assetsPicked="saveAssets"
    :incrementID="incrementID"
  ></ListAsset>
  <BudgetForm
    v-if="showBudgetForm"
    :budgetsSend="budgetsSend"
    @closeForm="closeBudgetForm"
    @saveBudgetForm="saveBudgetForm"
    :assetPicked="assetPicked"
  ></BudgetForm>
  <MWarningDefault
    v-if="showMWarningDefault"
    :text="validateMessage"
    @closeWarning="closeWarning"
  ></MWarningDefault>
  <MWarningSave
    v-if="showMWarningSave"
    @onSave="onSaveFormIncrement"
    @closeMWarningSave=" showMWarningSave = false;"
    @onCloseFormUpdate="closeNotSave"
  >
  </MWarningSave>
  <MWarningCancel v-if="showMWarningCancel" @closeMWarningCancel="showMWarningCancel=false" @onCancel="closeNotSave"></MWarningCancel>
</template>
<script>
import moment from "moment";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import BudgetForm from "../BudgetForm/BudgetForm.vue";
import PageNumber from "../PageNumber/PageNumber.vue";
import ListAsset from "../ListAsset/ListAsset.vue";
import MisaToolTip from "../MisaToolTip/MisaToolTip.vue";
import Enums from "@/helpers/enum";
import MWarningSave from "../MWarningSave/MWarningSave.vue";
import {
  getNewCodeIncrement,
  getIncrementInfor,
  insertIncrement,
  updateInrement,
} from "../../helpers/api";
import { ErrorIncrement, Message } from "../../helpers/resource.js";
import commonJS from "@/helpers/common";
import MWarningCancel from "../MWarningCancel/MWarningCancel.vue";
export default {
  name: "IncrementForm",
  props: ["incrementPicked", "formMode", "token"],
  components: {
    PageNumber,
    ListAsset,
    BudgetForm,
    MWarningDefault,
    MWarningSave,
    MisaToolTip,
    ProgressBar,
    MWarningCancel,
  },

  created() {
    this.errors = ErrorIncrement;
    this.errors[0].status = this.errors[1].status = this.errors[2].status = false;
    if (this.formMode == Enums.FormMode.Add) {
      this.formTitle = "Thêm mới chứng từ";
      this.increment = {};
      this.increment.production_year = moment(new Date()).format("YYYY-MM-DD");
      this.increment.increment_date = moment(new Date()).format("YYYY-MM-DD");
      this.incrementID = "00000000-0000-0000-0000-000000000000";
      getNewCodeIncrement((res) => {
        this.increment.fixed_asset_increment_code = res.data;
      });
    } else {
      this.formTitle =
        "Sửa chứng từ " + this.incrementPicked.fixed_asset_increment_code;
      this.increment = JSON.parse(JSON.stringify(this.incrementPicked));
      this.incrementID = this.increment.fixed_asset_increment_id;
      this.increment.production_year = moment(
        this.increment.production_year
      ).format("YYYY-MM-DD");
      this.increment.increment_date = moment(
        this.increment.increment_date
      ).format("YYYY-MM-DD");

      this.showProgressBarTable = true;
      getIncrementInfor(
        this.incrementPicked.fixed_asset_increment_id,
        this.handleInput
      );
    }
  },
  methods: {
    /**
     * Đóng form
     * Author: TMNghia 01/07/2023
     */
    closeNotSave() {
      this.$emit("closeForm");
    },
    /**
     * Đóng form nguồn hình thành
     * Author: TMNghia 01/07/2023
     */
    closeBudgetForm() {
      this.budgetsChoosen.push(...this.budgetsSend);
      this.showBudgetForm = false;
    },
    /**
     * Lưu form nguồn hình thành
     * Author: TMNghia 01/07/2023
     */
    saveBudgetForm(listBudget) {
      this.budgetsChoosen.push(...listBudget);
      this.showBudgetForm = false;
      this.changed = true;
    },
    /**
     * Mở form nguồn hình thành
     * Author: TMNghia 01/07/2023
     */
    openBudgetForm(item) {
      this.assetPicked = item;
      this.getListBudget(item);
      this.showBudgetForm = true;
    },
    /**
     * Focus input trống
     * Author: TMNghia 01/07/2023
     */
    closeWarning() {
      this.showMWarningDefault = false;
      if (this.validateMessages[0] == this.errors[0].value) {
        this.$refs.incrementCodeInput.focus();
      } else if(this.validateMessages[0] == this.errors[1].value) {
        this.$refs.productionYearInput.focus();
      } else if (this.validateMessages[0] == this.errors[2].value) {
        this.$refs.incrementDateInput.focus();
      } else if(this.saveAssets.length == 0) {
        this.$refs.openListAsset.focus();
      }
    },
    /**
     * Click ctrlS
     * Author: TMNghia 01/07/2023
     */
    onCtrlS() {
      if (!this.showBudgetForm && !this.showListAsset) {
        this.onSaveFormIncrement();
      }
    },
    /**
     * Lưu form
     * Author: TMNghia 01/07/2023
     */
    onSaveFormIncrement() {
      event.preventDefault();
      if (!this.validateForm()) {
        this.showMWarningDefault = true;
      } else {
        if (this.formMode == Enums.FormMode.Add) {
          this.addIncrement();
        } else {
          this.editIncrement();
        }
      }
    },
    /**
     * Thêm mới chứng từ
     * Author: TMNghia 01/07/2023
     */
    addIncrement() {
      let incrementRevision = {
        increment: this.increment,
        incrementDetails: this.getIncrementDetails().reverse(),
        budgets: this.budgetsChoosen,
      };
      this.showProgressBar = true;
      //Gọi API thêm mới
      insertIncrement(
        incrementRevision,
        () => {
          this.showProgressBar = false;
          this.$emit("insertSuccess");
        },
        (error) => {
          this.showProgressBar = false;
          this.validateMessage = commonJS.handleError(error);
          this.showMWarningDefault = true;
        }
      );
    },
    /**
     * Sửa chứng từ
     * Author: TMNghia 01/07/2023
     */
    editIncrement() {
      let incrementRevision = {
        increment: this.increment,
        incrementDetails: this.getIncrementDetails().reverse(),
        budgets: this.budgetsChoosen,
      };
      this.showProgressBar = true;
      //Gọi API sửa
      updateInrement(
        incrementRevision,
        this.countDetails,
        this.countBudgets,
        () => {
          this.showProgressBar = false;
          this.$emit("updateSuccess");
        },
        (error) => {
          this.showProgressBar = false;
          this.validateMessage = commonJS.handleError(error);
          this.showMWarningDefault = true;
        }
      );
    },
    /**
     * Validate form
     * Author: TMNghia 01/07/2023
     */
    validateForm() {
      this.validateMessage = "";
      this.validateMessages = [];

      if (!this.increment.fixed_asset_increment_code) { //Kiểm tra mã
        this.errors[0].status = true;
        this.validateMessages.push(this.errors[0].value);
      }
      if (!this.increment.production_year) {  //Kiểm tra ngày sử dụng
        this.errors[1].status = true;
        this.validateMessages.push(this.errors[1].value);
      }
      if (!this.increment.increment_date) { //Kiểm tra ngày ghi tăng
        this.errors[2].status = true;
        this.validateMessages.push(this.errors[2].value);
      }
      if (this.saveAssets.length == 0) { //Kiểm tra đã chọn tài sản nào chưa
        this.validateMessages.push(Message.requestAtleastOne);
      }
      if (this.validateMessages.length > 0) {
        this.validateMessage = this.validateMessages.join("/");
        return false;
      }
      return true;
    },
    /**
     * Validate khi blur input
     * Author: TMNghia 01/07/2023
     */
    blurInput(val, index) {
      if (val == null || val == "" || val == undefined) {
        this.errors[index].status = 1;
      } else {
        this.errors[index].status = null;
      }
    },
    /**
     * Phân trang chi tiết chứng từ
     * Author: TMNghia 01/07/2023
     */
    getFilterRecords(pageSize, currentPage) {
      this.filterAssets(pageSize, currentPage);
      this.curr = currentPage;
      this.size = pageSize;
    },
    /**
     * Phân trang chi tiết
     * Author: TMNghia 01/07/2023
     */
    filterAssets(pageSize, currentPage) {
      this.listAssets = this.assets.slice(
        pageSize * (currentPage - 1),
        pageSize * currentPage
      );
    },
    /**
     * Xoá bỏ chi tiết
     * Author: TMNghia 01/07/2023
     */
    removeAsset(item, index) {
      event.stopPropagation();
      this.assets.splice(index, 1);
      this.saveAssets.splice(index, 1);
      this.filterAssets(this.size, this.curr);
      this.removeBudget(item);
      this.deleteFromAssets(item);
      this.changed = true;
    },
    /**
     * Thêm tài sản vào chi tiết
     * Author: TMNghia 01/07/2023
     */
    IncrementListAsset(list) {
      this.assets = [...list, ...this.assets];
      this.saveAssets = JSON.parse(JSON.stringify(this.assets));
      this.showListAsset = false;
      this.filterAssets(this.size, this.curr);
      this.changed = true;
    },
    /**
     * Tìm kiếm tài sản
     * Author: TMNghia 01/07/2023
     */
    searchAsset() {
      let result = this.saveAssets.filter((item) => {
        return (
          item.fixed_asset_code.includes(this.keyword) ||
          item.fixed_asset_name.includes(this.keyword)
        );
      });
      this.assets = result;
      this.filterAssets(this.size, this.curr);
    },
    /**
     * Xử lý dữ liệu đầu vào
     * Author: TMNghia 01/07/2023
     */
    handleInput(res) {
      this.assets = res.data.incrementDetails;
      this.saveAssets = JSON.parse(JSON.stringify(this.assets));
      this.budgetsChoosen = JSON.parse(JSON.stringify(res.data.budgets));
      this.filterAssets(this.size, this.curr);
      this.countBudgets = this.budgetsChoosen.length;
      this.countDetails = this.saveAssets.length;
      this.showProgressBarTable = false;
    },
    /**
     * Lấy danh sách ID tài sản
     * Author: TMNghia 01/07/2023
     */
    getListAssetID(assets) {
      let listID = [];
      for (let i = 0; i < assets.length; i++) {
        listID.push(assets[i].fixed_asset_increment_id);
      }
    },
    /**
     * Lấy danh sách nguồn hình thành theo tài sản
     * Author: TMNghia 01/07/2023
     */
    getListBudget(asset) {
      this.budgetsSend = [];
      for (let i = 0; i < this.budgetsChoosen.length; i++) {
        if (this.budgetsChoosen[i].fixed_asset_id == asset.fixed_asset_id) {
          this.budgetsSend.push(this.budgetsChoosen[i]);
          this.budgetsChoosen[i] = null;
        }
      }
      this.budgetsChoosen = commonJS.filterArray(this.budgetsChoosen);
    },
    /**
     * Lọc danh sách chi tiết chứng từ
     * Author: TMNghia 01/07/2023
     */
    getIncrementDetails() {
      let incrementDetails = [];
      for (let i = 0; i < this.saveAssets.length; i++) {
        incrementDetails.push({
          fixed_asset_increment_detail_id:
            this.saveAssets[i].fixed_asset_increment_detail_id,
          fixed_asset_increment_id: this.saveAssets[i].fixed_asset_increment_id,
          fixed_asset_id: this.saveAssets[i].fixed_asset_id,
          modified_date: new Date(),
          sort_index: 0,
        });
      }
      return incrementDetails;
    },
    /**
     * Xoá nguồn hình thành khi xoá chi tiết
     * Author: TMNghia 01/07/2023
     */
    removeBudget(item) {
      for (let i = 0; i < this.budgetsChoosen.length; i++) {
        if (this.budgetsChoosen[i].fixed_asset_id == item.fixed_asset_id) {
          this.budgetsChoosen[i] = null;
        }
      }
      this.budgetsChoosen = commonJS.filterArray(this.budgetsChoosen);
    },
    /**
     * Đóng form
     * Author: TMNghia 01/07/2023
     */
    onCloseFormIncrement() {
      if (this.changed) {
        if (this.formMode == Enums.FormMode.Update) {
          this.showMWarningSave = true;
        } else {
          this.showMWarningCancel = true;
        }
      } else {
        this.$emit("closeForm");
      }
    },
    /**
     * Bấm nút Esc
     * Author: TMNghia 01/07/2023
     */
    onEsc() {
      if (this.showBudgetForm == true) {
        this.showBudgetForm = false;
        this.budgetsChoosen.push(...this.budgetsSend);
      } else if (this.showListAsset == true) {
        this.showListAsset = false;
      } else {
        this.onCloseFormIncrement();
      }
    },
    /**
     * Bấm nút Enter
     * Author: TMNghia 01/07/2023
     */
    onEnter() {
      if (this.isTyping) {
        this.searchAsset();
      }
      if (this.btnCancelFocused) {
        this.onCloseFormIncrement();
      }
      if (this.btnSaveFocused) {
        this.onSaveFormIncrement();
      }
    },
    /**
     * Thay đổi giá trị
     * Author: TMNghia 01/07/2023
     */
    changedValue() {
      this.changed = true;
    },
    /**
     * Xoá phần tử ở danh sách gốc
     * Author: TMNghia 01/07/2023
     */
    deleteFromAssets(item) {
      for (let i = 0; i < this.saveAssets.length; i++) {
        if (item.fixed_asset_id == this.saveAssets[i].fixed_asset_id) {
          this.saveAssets.splice(i, 1);
          break;
        }
      }
    },
    lastItemTab() {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Tab:
          event.preventDefault();
        this.$refs.incrementCodeInput.focus();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$refs.incrementCodeInput.focus();
  },
  data() {
    return {
      countBudgets: 0,
      countDetails: 0,
      budgetsSend: [],
      assetsChoosen: [],
      budgetsChoosen: [],
      formTitle: "",
      showListAsset: false,
      showBudgetForm: false,
      increment: {},
      assets: [],
      listAssets: [],
      curr: 1,
      size: 20,
      isTyping: false,
      keyword: "",
      saveAssets: [],
      errors: ErrorIncrement,
      validateMessage: "",
      validateMessages: [],
      showMWarningDefault: false,
      assetPicked: {},
      i: 0,
      changed: false,
      showMWarningSave: false,
      btnCancelFocused: false,
      btnSaveFocused: false,
      incrementID: "",
      showProgressBar: false,
      showProgressBarTable: false,
      showMWarningCancel: false,
    };
  },
  computed: {
    totalCost() {
      let total = 0;
      for (let i = 0; i < this.assets.length; i++) {
        total += this.assets[i].cost;
      }
      return total;
    },
    totalDep() {
      let total = 0;
      for (let i = 0; i < this.assets.length; i++) {
        total += (this.assets[i].cost * this.assets[i].depreciation_rate) / 100;
      }
      return total;
    },
    totalRecords() {
      return this.assets.length;
    },
  },
  watch: {
    keyword(val) {
      if (val == "") {
        this.assets = JSON.parse(JSON.stringify(this.saveAssets));
        this.filterAssets(this.size, this.curr);
      }
    },
    increment() {
      if (this.i > 1) {
        this.changed = true;
      } else {
        this.changed = false;
      }
      this.i++;
    },
  },
};
</script>
<style>
@import url("./IncrementForm.css");
</style>
