<template>
  <div class="popup" v-esc="closeForm" v-ctrls="onSaveForm">
    <div class="popup-wrapper">
      <!-- Form header -->
      <div class="popup-header">
        <p>{{ titleForm }}</p>
        <div class="tooltip">
          <i class="icon-close popup-close" @mousedown="closeForm"></i>
          <span class="tooltiptext">Thoát</span>
        </div>
      </div>
      <!-- Form body -->
      <div class="popup-body">
        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[0].status }"
          >
            <p>Mã tài sản <span>*</span></p>
            <input
              ref="textAssetID"
              v-model="elements.fixed_asset_code"
              :class="{ 'border-error': ErrorElementArray[0].status }"
              @blur="onValidateItem(0)"
              type="text"
              placeholder="Nhập mã tài sản"
              class="popup-free-type input-blue"
              id="form-id"
              tabindex="1"
              required
              pattern="TS[0-9][0-9][0-9][0-9][0-9]"
              maxlength="50"
            />
            <div class="error-text" v-if="ErrorElementArray[0].status">
              {{ ErrorElementArray[0].value }}
            </div>
          </div>
          <div
            class="popup-body-item-full"
            :class="{ 'remove-margin': ErrorElementArray[1].status }"
          >
            <p>Tên tài sản <span>*</span></p>
            <input
              v-model="elements.fixed_asset_name"
              :class="{ 'border-error': ErrorElementArray[1].status }"
              @blur="onValidateItem(1)"
              type="text"
              placeholder="Nhập tên tài sản"
              class="popup-free-type input-blue"
              id="form-name"
              tabindex="2"
              maxlength="255"
            />
            <div class="error-text" v-if="ErrorElementArray[1].status">
              {{ ErrorElementArray[1].value }}
            </div>
          </div>
        </div>

        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[2].status }"
            v-outSide="
              () => {
                departmentShow = false;
              }
            "
          >
            <p>Mã bộ phận sử dụng <span>*</span></p>
            <input
              ref="departmentInput"
              v-model="elements.department_code"
              :class="{ 'border-error': ErrorElementArray[2].status }"
              @blur="onValidateItem(2)"
              type="text"
              class="popup-body-select input-blue"
              placeholder="Chọn mã bộ phận sử dụng"
              id="form-department-id"
              tabindex="3"
              @focus="
                departmentShow = true;
                categoryShow = false;
                indexSelected = null;
              "
              @click="$event.stopPropagation()"
              readonly="true"
              @keydown="inputOnKeyDown(departments)"
            />
            <div class="error-text" v-if="ErrorElementArray[2].status">
              {{ ErrorElementArray[2].value }}
            </div>
            <div class="show-combobox" @click="departmentShow = true">
              <i class="icon-down"></i>
              <div class="list-item" v-show="departmentShow">
                <a
                  v-for="(item, index) in departments"
                  class="item"
                  :key="index"
                  @click="clickItemDepartment(item.department_code)"
                  :class="{ 'item-selected': index == indexSelected }"
                >
                  {{ item.department_code }}
                </a>
              </div>
            </div>
          </div>
          <div class="popup-body-item-full">
            <p>Tên bộ phận sử dụng</p>
            <div class="popup-read-only">
              <p>{{ elements.department_name }}</p>
            </div>
          </div>
        </div>

        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[3].status }"
            v-outSide="
              () => {
                categoryShow = false;
              }
            "
          >
            <p>Mã loại tài sản <span>*</span></p>
            <input
              ref="categoryInput"
              v-model="elements.fixed_asset_category_code"
              :class="{ 'border-error': ErrorElementArray[3].status }"
              @blur="onValidateItem(3)"
              type="text"
              class="popup-body-select input-blue"
              placeholder="Chọn mã loại tài sản"
              id="form-category-id"
              tabindex="4"
              @change="changeItemCategory"
              @focus="
                categoryShow = true;
                departmentShow = false;
                indexSelected = null;
              "
              readonly="true"
              @keydown="inputOnKeyDown(categories)"
            />
            <div class="error-text" v-if="ErrorElementArray[3].status">
              {{ ErrorElementArray[3].value }}
            </div>
            <div class="show-combobox list-second" @click="categoryShow = true">
              <i class="icon-down"></i>
              <div class="list-item" v-show="categoryShow">
                <a
                  v-for="(item, index) in categories"
                  class="item"
                  :key="index"
                  @click="clickItemCategory(item.fixed_asset_category_code)"
                  :class="{ 'item-selected': index == indexSelected }"
                >
                  {{ item.fixed_asset_category_code }}
                </a>
              </div>
            </div>
          </div>
          <div class="popup-body-item-full">
            <p>Tên loại</p>
            <div class="popup-read-only">
              <p>{{ elements.fixed_asset_category_name }}</p>
            </div>
          </div>
        </div>

        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[4].status }"
          >
            <p>Số lượng <span>*</span></p>
            <input
              v-model="elements.quantity"
              :class="{ 'border-error': ErrorElementArray[4].status }"
              @blur="onValidateItem(4)"
              type="text"
              class="popup-number-pick input-blue"
              id="form-quantity"
              tabindex="5"
              @keypress="restrictChars($event)"
              @input="formatQuantity(elements.quantity)"
              @focus="categoryShow = false"
            />
            <div class="error-text" v-if="ErrorElementArray[4].status">
              {{ ErrorElementArray[4].value }}
            </div>
            <div class="header-year-move">
              <div class="number-up" @click="addNumber(elements.quantity)">
                <i class="header-icon-up icon-up"></i>
              </div>
              <div class="number-down" @click="minusNumber(elements.quantity)">
                <i class="icon-down"></i>
              </div>
            </div>
          </div>
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[5].status }"
          >
            <p>Nguyên giá <span>*</span></p>
            <input
              v-model="elements.cost"
              :class="{ 'border-error': ErrorElementArray[5].status }"
              @blur="onValidateItem(5)"
              type="text"
              class="popup-number-type input-blue"
              id="form-price"
              tabindex="6"
              @input="formatPrice(elements.cost)"
              @keypress="restrictChars($event)"
              maxlength="26"
            />
            <div class="error-text" v-if="ErrorElementArray[5].status">
              {{ ErrorElementArray[5].value }}
            </div>
          </div>
          <div class="popup-body-item-half">
            <p>Số năm sử dụng</p>
            <div class="popup-read-only popup-read-only-year">
              <p>{{ elements.life_time }}</p>
            </div>
          </div>
        </div>

        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[6].status }"
          >
            <p>Tỷ lệ hao mòn (%)</p>
            <input
              v-model="elements.depreciation_rate"
              :class="{ 'border-error': ErrorElementArray[6].status }"
              @blur="onValidateItem(6)"
              type="text"
              class="popup-number-pick input-blue"
              id="form-quantity"
              tabindex="7"
              @input="depreciationChange()"
            />
            <div class="error-text" v-if="ErrorElementArray[6].status">
              {{ ErrorElementArray[6].value }}
            </div>
            <div class="header-year-move">
              <div
                class="number-up"
                @click="addNumberRate(elements.depreciation_rate)"
              >
                <i class="header-icon-up icon-up"></i>
              </div>
              <div
                class="number-down"
                @click="minusNumberRate(elements.depreciation_rate)"
              >
                <i class="icon-down"></i>
              </div>
            </div>
          </div>

          <div class="popup-body-item-half">
            <p>Giá trị hao mòn năm</p>
            <input
              class="popup-read-only align-right"
              readonly="true"
              v-model="elements.atrophy"
            />
          </div>
          <div class="popup-body-item-half">
            <p>Năm theo dõi</p>
            <div class="popup-read-only popup-read-only-year">
              <p>{{ elements.tracked_year }}</p>
            </div>
          </div>
        </div>

        <div class="popup-body-item-flex">
          <div
            class="popup-body-item-half"
            :class="{ 'remove-margin': ErrorElementArray[7].status }"
          >
            <p>Ngày mua <span>*</span></p>
            <input
              v-model="elements.purchase_date"
              :class="{ 'border-error': ErrorElementArray[7].status }"
              @blur="onValidateItem(7)"
              type="date"
              class="popup-free-type input-blue"
              placeholder="yy/MM/dd"
              id="form-date-buy"
              tabindex="8"
            />
            <i class="icon-date popup-date-icon"></i>
            <div class="error-text" v-if="ErrorElementArray[7].status">
              {{ ErrorElementArray[7].value }}
            </div>
          </div>

          <div class="popup-body-item-full popup-body-item-pair">
            <div
              class="popup-body-item-half"
              :class="{ 'remove-margin': ErrorElementArray[8].status }"
            >
              <p>Ngày bắt đầu sử dụng <span>*</span></p>
              <input
                v-model="elements.production_year"
                :class="{ 'border-error': ErrorElementArray[8].status }"
                @blur="onValidateItem(8)"
                type="date"
                class="popup-free-type input-blue"
                id="form-use-date"
                tabindex="9"
              />
              <i class="icon-date popup-date-icon"></i>
              <div class="error-text" v-if="ErrorElementArray[8].status">
                {{ ErrorElementArray[8].value }}
              </div>
            </div>
            <div class="popup-body-item-half"></div>
          </div>
        </div>
      </div>

      <!-- Form footer -->
      <div class="popup-footer">
        <div
          class="btn btn-normal btn-cancel"
          tabindex="11"
          @click="closeForm"
          ref="lastItem"
          @keydown="lastItemTab"
        >
          Huỷ
        </div>
        <div
          class="btn btn-blue btn-save"
          tabindex="10"
          @click="onSaveForm"
          ref="prevLastItem"
          @keydown="onKeyDownSave"
        >
          Lưu
        </div>
      </div>

      <MWarningDefault
        :text="warningMessage"
        v-if="warningShow"
        @closeWarning="warningShow = false"
      ></MWarningDefault>

      <MWarningSave
        v-if="showMWarningSave"
        @closeMWarningSave="showMWarningSave = false"
        @onSave="editAsset()"
        @onCloseFormUpdate="onlyCloseFormPopup()"
      ></MWarningSave>

      <MWarningCancel
        v-if="showMWarningCancel"
        @closeMWarningCancel="showMWarningCancel = false"
        @onCancel="onlyCloseFormPopup()"
      ></MWarningCancel>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import MWarningCancel from "../MWarningCancel/MWarningCancel.vue";
import MWarningSave from "../MWarningSave/MWarningSave.vue";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import Enums from "@/helpers/enum";
import assetsAPI, { ErrorElements } from "../../helpers/resource.js";
import commonJS from "@/helpers/common";
import { getNewCodeAsset, insertAsset, updateAsset } from "../../helpers/api";

export default {
  name: "FormPopup",
  components: { MWarningSave, MWarningCancel, MWarningDefault },
  props: ["itemSelected", "formMode", "token"],

  // Khởi tạo form
  created() {
    this.GetDepartments();
    this.GetCategories();
    if (this.formMode == Enums.FormMode.Add) {
      this.GetAssets(this.RenderAssets);
      this.titleForm = "Thêm tài sản";
    } else if (
      this.formMode == Enums.FormMode.Update ||
      this.formMode == Enums.FormMode.Copy
    ) {
      this.titleForm =
        this.formMode == Enums.FormMode.Update
          ? "Sửa tài sản"
          : "Nhân bản tài sản";
      this.saveAssetSelected = JSON.stringify(this.itemSelected);
      this.elements = JSON.parse(this.saveAssetSelected);

      this.elements.depreciation_rate = commonJS.formatMoney(
        this.elements.depreciation_rate
      );
      this.elements.quantity = commonJS.formatMoney(this.elements.quantity);
      this.elements.cost = commonJS.formatMoney(this.elements.cost);
      this.elements.production_year = moment(
        this.elements.production_year
      ).format("YYYY-MM-DD");
      this.elements.purchase_date = moment(this.elements.purchase_date).format(
        "YYYY-MM-DD"
      );

      this.buyDateChange = this.elements.purchase_date;
      this.useDateChange = this.elements.production_year;
      this.priceChange = this.elements.cost;
      this.quantityChange = commonJS.unFormatMoney(this.elements.quantity);
    }

    if (
      this.formMode == Enums.FormMode.Add ||
      this.formMode == Enums.FormMode.Copy
    ) {
      getNewCodeAsset((res) => {
        this.elements.fixed_asset_code = res.data;
      }, this.handleError);
    }
  },

  updated() {
    this.quantityChange = this.elements.quantity;
    this.priceChange = this.elements.cost;
    this.buyDateChange = this.elements.purchase_date;
    this.useDateChange = this.elements.production_year;
  },
  // focus ô input đầu
  mounted() {
    this.$refs.textAssetID.focus();
    this.getAssetUpdate = JSON.stringify(this.elements);
  },

  methods: {
    /**
     * Hàm hứng lỗi từ server
     * Author: TMNghia 10/05/2023
     */
    handleError(error) {
      if (error.response.status == 404 || error.response.status == 400) {
        this.warningMessage = error.response.data;
      } else if (error.response.status == 415) {
        this.warningMessage = this.errorMessage415;
      } else if (error.response.status == 500) {
        this.warningMessage = error.response.data.userMsg;
      }
      this.warningShow = true;
      this.showWarningDelete = false;
    },

    /**
     * Hàm xử lý ô tab cuối cùng
     * Author: TMNghia 05/05/2023
     */
    lastItemTab() {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Tab:
          this.$refs.textAssetID.focus();
          break;
        default:
          break;
      }
    },
    onKeyDownSave() {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Enter:
          this.onSaveForm();
          break;
        default:
          break;
      }
    },

    /**
     *Hàm đóng form
     *Author: TMNghia (29/3/2023)
     */
    closeForm() {
      if (this.formMode == Enums.FormMode.Add) {
        if (this.isChanged()) {
          this.onlyCloseFormPopup();
        } else {
          this.showMWarningCancel = true;
        }
      } else if (
        (this.getAssetUpdate == JSON.stringify(this.elements) &&
          this.formMode == Enums.FormMode.Update) ||
        this.formMode == Enums.FormMode.Copy
      ) {
        this.onlyCloseFormPopup();
      } else {
        this.showMWarningSave = true;
      }
    },

    /**
     * Hàm callback đóng form
     * Author: TMNghia 12/04/2023
     */
    closeFormPopup() {
      this.$emit("onCloseForm");
      this.clearForm();
    },
    onlyCloseFormPopup() {
      this.$emit("onOnlyCloseForm");
      this.clearForm();
    },
    /**
     *Hàm validate tất cả trong form
     *Author: TMNghia (29/3/2023)
     */
    onValidate() {
      let index = 0;
      this.warningMessage = "";
      this.getElementsValidate();
      for (let value of Object.values(this.elementsValidate)) {
        if (index == this.ErrorElementArray.length) {
          break;
        } else {
          if (value == "" || value == undefined) {
            this.isOK = false;
            this.ErrorElementArray[index].status = "1";
            this.warningMessage += this.ErrorElementArray[index].value + "/";
          } else {
            this.ErrorElementArray[index].status = "";
          }
          index++;
        }
      }
      if (
        new Date(this.elements.purchase_date) >
        new Date(this.elements.production_year)
      ) {
        this.warningMessage +=
          "Ngày sử dụng không được nhỏ hơn ngày mua!" + "/";
        this.isOK = false;
      }
    },

    /**
     *Hàm ẩn combobox
     *Author: TMNghia (18/4/2023)
     */
    unShowCombobox() {
      if (this.departmentShow) {
        this.departmentShow = false;
      }
      if (this.categoryShow) {
        this.categoryShow = false;
      }
    },

    /*
     *Hàm validate từng input
     *Author: TMNghia (29/3/2023)
     */
    onValidateItem(index) {
      let array = [];
      array = this.ErrorElementArray;
      this.getElementsValidate();
      this.elementValues = Object.values(this.elementsValidate);
      if (
        this.elementValues[index] == "" ||
        this.elementValues[index] == undefined
      ) {
        array[index].status = "1";
      } else {
        array[index].status = "";
      }
    },

    /**
     *Hàm submit form
     *Author: TMNghia (29/3/2023)
     */
    onSaveForm() {
      console.log(this.elemets);
      event.preventDefault();
      this.isOK = true;
      this.onValidate();
      if (this.isOK) {
        if (
          this.formMode == Enums.FormMode.Add ||
          this.formMode == Enums.FormMode.Copy
        ) {
          this.addAsset();
        } else {
          this.editAsset();
        }
      } else {
        this.warningShow = true;
      }
    },

    /**
     *Hàm thêm dữ liệu mới
     *Author: TMNghia (30/3/2023)
     */
    addAsset() {
      insertAsset(
        {
          fixed_asset_id: "00000000-0000-0000-0000-000000000000",
          fixed_asset_code: this.elements.fixed_asset_code,
          fixed_asset_name: this.elements.fixed_asset_name,
          department_id: this.elements.department_id,
          department_code: this.elements.department_code,
          department_name: this.elements.department_name,
          fixed_asset_category_id: this.elements.fixed_asset_category_id,
          fixed_asset_category_code: this.elements.fixed_asset_category_code,
          fixed_asset_category_name: this.elements.fixed_asset_category_name,
          quantity:
            commonJS.unFormatMoney(this.elements.quantity) == 0
              ? null
              : commonJS.unFormatMoney(this.elements.quantity),
          cost:
            commonJS.unFormatMoney(this.elements.cost) == 0
              ? null
              : commonJS.unFormatMoney(this.elements.cost),
          purchase_date: this.elements.purchase_date,
          production_year: this.elements.production_year,
          depreciation_rate:
            this.unFormatRate(this.elements.depreciation_rate) == 0
              ? null
              : this.unFormatRate(this.elements.depreciation_rate),
          life_time: this.elements.life_time,
          tracked_year: this.elements.tracked_year,
          created_date: new Date(),
          modified_date: new Date(),
        },
        () => {
          this.closeFormPopup();
          this.showToastMessage();
        },
        (error) => {
          if (error.response.status == 400 || error.response.status == 404) {
            this.warningMessage = error.response.data.join("/");
            this.warningShow = true;
          } else if (error.response.status == 500) {
            this.warningMessage = error.response.data.userMsg;
            this.warningShow = true;
          }
        }
      );
    },

    /**
     *Hàm sửa dữ liệu
     *Author: TMNghia (30/3/2023)
     */
    editAsset() {
      updateAsset(
        {
          fixed_asset_id: this.elements.fixed_asset_id,
          fixed_asset_code: this.elements.fixed_asset_code,
          fixed_asset_name: this.elements.fixed_asset_name,
          department_id: this.elements.department_id,
          department_code: this.elements.department_code,
          department_name: this.elements.department_name,
          fixed_asset_category_id: this.elements.fixed_asset_category_id,
          fixed_asset_category_code: this.elements.fixed_asset_category_code,
          fixed_asset_category_name: this.elements.fixed_asset_category_name,
          quantity:
            commonJS.unFormatMoney(this.elements.quantity) == 0
              ? null
              : commonJS.unFormatMoney(this.elements.quantity),
          cost:
            commonJS.unFormatMoney(this.elements.cost) == 0
              ? null
              : commonJS.unFormatMoney(this.elements.cost),
          purchase_date: this.elements.purchase_date,
          production_year: this.elements.production_year,
          depreciation_rate:
            this.unFormatRate(this.elements.depreciation_rate) == 0
              ? null
              : this.unFormatRate(this.elements.depreciation_rate),
          life_time: this.elements.life_time,
          tracked_year: this.elements.tracked_year,
          modified_date: new Date(),
        },
        () => {
          this.closeFormPopup();
          this.showToastMessage();
        },
        (error) => {
          if (error.response.status == 400) {
            this.warningMessage = error.response.data.join("/");
            this.warningShow = true;
          } else if (error.response.status == 500) {
            this.warningMessage = error.response.data.userMsg;
            this.warningShow = true;
          }
        }
      );
    },

    /**
     *Hàm clear form khi đóng form
     *Author: TMNghia (18/4/2023)
     */
    clearForm() {
      let array = [];
      array = this.ErrorElementArray;
      array.map((item) => {
        item.status = "";
      });
    },

    /**
     *Hàm hiện toast message
     *Author: TMNghia (18/4/2023)
     */
    showToastMessage() {
      this.$emit("onSuccessForm");
    },

    /**
     *Hàm chọn giá trị trong combobox
     *Author: TMNghia (18/4/2023)
     */
    clickItemDepartment(item) {
      event.stopPropagation();
      this.elements.department_code = item;
      this.departmentIDChange = item;
      this.$refs.departmentInput.focus();
      this.departmentShow = false;
    },

    /**
     *Hàm chọn giá trị trong combobox
     *Author: TMNghia (18/4/2023)
     */
    clickItemCategory(item) {
      event.stopPropagation();
      this.categoryIDChange = item;
      this.elements.fixed_asset_category_code = item;
      this.$refs.categoryInput.focus();
      this.categoryShow = false;
    },

    /**
     *Hàm lấy dữ liệu tài sản
     *Author: TMNghia (18/4/2023)
     */
    GetAssets(callback) {
      axios
        .get(assetsAPI, { headers: `Authorization: Bearer ${this.token}` })
        .then(callback)
        .catch(this.handleError);
    },

    /**
     *Hàm lưu dữ liệu tài sản
     *Author: TMNghia (18/4/2023)
     */
    RenderAssets(res) {
      this.assets = res.data;
    },

    /**
     *Hàm lấy dữ liệu bộ phận
     *Author: TMNghia (18/4/2023)
     */
    GetDepartments() {
      axios
        .get("https://localhost:44375/api/Departments/", {
          headers: `Authorization: Bearer ${this.token}`,
        })
        .then((response) => {
          this.departments = response.data;
        })
        .catch(this.handleError);
    },
    /**
     *Hàm lấy dữ liệu loại tài sản
     *Author: TMNghia (18/4/2023)
     */
    GetCategories() {
      axios
        .get("https://localhost:44375/api/Categories/", {
          headers: `Authorization: Bearer ${this.token}`,
        })
        .then((response) => {
          this.categories = response.data;
        })
        .catch(this.handleError);
    },
    /**
     * Khối hàm cộng giá trị cho number
     * Author: TMNghia 10/04/2023
     */
    addNumber(value) {
      if (value == undefined || value == "") {
        this.elements.quantity = 1;
      } else {
        value = commonJS.unFormatMoney(value);
        value = value * 1 + 1;
        if (value <= 0) {
          value = 0;
        }
        this.elements.quantity = commonJS.formatMoney(value);
      }
    },
    /**
     *Hàm bấm cộng trừ
     *Author: TMNghia (18/4/2023)
     */
    minusNumber(value) {
      if (value == undefined || value == "") {
        this.elements.quantity = 0;
      } else {
        value = commonJS.unFormatMoney(value);
        value = value * 1 - 1;
        if (value <= 0) {
          value = 0;
        }
        this.elements.quantity = commonJS.formatMoney(value);
      }
    },
    /**
     *Hàm bấm cộng trừ
     *Author: TMNghia (18/4/2023)
     */
    addNumberRate(value) {
      if (value == undefined) {
        this.elements.depreciation_rate = "1";
      } else {
        value = value + "";
        if (value.includes(",")) {
          value = value.replace(",", ".");
          value = value * 1 + 1;
        } else {
          value = value * 1 + 1;
        }
        if (value <= 0) {
          value = 0;
        }
        value = (value + "").replace(".", ",");
        this.elements.depreciation_rate = value + "";
      }
    },
    /**
     *Hàm bấm cộng trừ
     *Author: TMNghia (18/4/2023)
     */
    minusNumberRate(value) {
      if (value == undefined) {
        this.elements.depreciation_rate = "0";
      } else {
        value = value + "";
        if (value.includes(",")) {
          value = value.replace(",", ".");
          value = value * 1 - 1;
        } else {
          value = value * 1 - 1;
        }
        if (value <= 0) {
          value = 0;
        }
        value = (value + "").replace(".", ",");
        this.elements.depreciation_rate = value + "";
      }
    },
    /**
     *Hàm format ô tỷ lệ hao mòn
     *Author: TMNghia (18/4/2023)
     */
    formatDepreciationRate(value) {
      if (typeof value == "number") {
        value = value + "";
        if (value.includes(".")) {
          return value.split(".").join(",");
        } else {
          return value;
        }
      } else {
        // if (value.length > 2 && !value.includes(",")) {
        //   value.replace(",", "");
        //   value =
        //     value.substring(0, 2) + "," + value.substring(2, value.length);
        //   return value;
        // }
        // else {
        // }
        return value;
      }
    },
    /**
     *Hàm tính giá trị hao mòn
     *Author: TMNghia (18/4/2023)
     */
    depreciationChange() {
      this.elements.depreciation_rate = commonJS.fNumber(
        this.elements.depreciation_rate
      );
      this.elements.depreciation_rate = commonJS.formatMoney(
        this.elements.depreciation_rate
      );
      if (
        this.elements.cost &&
        this.elements.quantity &&
        this.elements.depreciation_rate
      ) {
        this.elements.atrophy = commonJS.formatMoney(
          (commonJS.unFormatMoney(this.elements.cost) *
            1 *
            commonJS.unFormatMoney(this.elements.quantity) *
            1 *
            this.unFormatRate(this.elements.depreciation_rate) *
            1) /
            100
        );
      } else {
        this.elements.atrophy = 0;
      }
    },
    /**
     *Hàm check form đã thay đổi chưa
     *Author: TMNghia (18/4/2023)
     */
    isChanged() {
      if (
        this.elements.fixed_asset_name == undefined &&
        this.elements.department_code == undefined &&
        this.elements.fixed_asset_category_code == undefined &&
        this.elements.quantity == undefined &&
        this.elements.cost == undefined &&
        this.elements.production_year == undefined &&
        this.elements.purchase_date == undefined
      ) {
        return true;
      } else {
        return false;
      }
    },
    /**
     *Hàm format giá
     *Author: TMNghia (18/4/2023)
     */
    formatPrice(value) {
      this.elements.cost = commonJS.formatMoney(value);
    },
    formatQuantity(value) {
      this.elements.quantity = commonJS.formatMoney(value);
    },

    /**
     *Hàm bỏ format tỷ lệ hao mòn
     *Author: TMNghia (18/4/2023)
     */
    unFormatRate(value) {
      try {
        value = value.split(".").join("");
        if (value.includes(",")) {
          value = value.split(",");
          let decimal = value[1];
          let integer = value[0];
          if (decimal) {
            return (
              integer * 1 +
              (decimal * 1) / Math.pow(10, (decimal + "").length)
            ).toFixed(decimal.length);
          } else if (integer) {
            return integer;
          }
        } else {
          return value;
        }
      } catch (error) {
        return 0;
      }
    },
    /**
     *Hàm lấy giá trị các ô input để validate
     *Author: TMNghia (18/4/2023)
     */
    getElementsValidate() {
      this.elementsValidate.fixed_asset_code = this.elements.fixed_asset_code;
      this.elementsValidate.fixed_asset_name = this.elements.fixed_asset_name;
      this.elementsValidate.department_code = this.elements.department_code;
      this.elementsValidate.fixed_asset_category_code =
        this.elements.fixed_asset_category_code;
      this.elementsValidate.quantity = this.elements.quantity;
      this.elementsValidate.cost = this.elements.cost;
      this.elementsValidate.depreciation_rate = this.elements.depreciation_rate;
      this.elementsValidate.purchase_date = this.elements.purchase_date;
      this.elementsValidate.production_year = this.elements.production_year;
    },
    /**
     *Hàm chỉ nhập số
     *Author: TMNghia (18/4/2023)
     */
    restrictChars: function ($event) {
      if (
        $event.charCode === 0 ||
        /\d/.test(String.fromCharCode($event.charCode))
      ) {
        return true;
      } else {
        $event.preventDefault();
      }
    },
    /**
     *Hàm bấm phím trên keyboard
     *Author: TMNghia (18/4/2023)
     */
    inputOnKeyDown(array) {
      // if (this.warningShow && this.showMWarningCancel && !this.showMWarningSave) {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.ArrowDown:
          if (this.indexSelected == null) {
            this.indexSelected = 0;
          } else if (this.indexSelected == array.length - 1) {
            this.indexSelected = 0;
          } else {
            this.indexSelected++;
          }
          break;
        case Enums.KeyBoard.ArrowUp:
          if (this.indexSelected == null) {
            this.indexSelected = array.length - 1;
          } else if (this.indexSelected == 0) {
            this.indexSelected = array.length - 1;
          } else {
            this.indexSelected--;
          }
          break;
        case Enums.KeyBoard.Enter:
          if (array == this.departments) {
            if (this.indexSelected == null) {
              this.departmentShow = true;
            } else {
              this.clickItemDepartment(
                array[this.indexSelected].department_code
              );
            }
          } else {
            if (this.indexSelected == null) {
              this.categoryShow = true;
            } else {
              this.clickItemCategory(
                array[this.indexSelected].fixed_asset_category_code
              );
            }
          }
          break;

        default:
          break;
      }
      // }
    },
    /**
     *Hàm bấm phím trên bàn phím
     *Author: TMNghia (18/4/2023)
     */
    formKeyDown() {
      // if (!this.warningShow && !this.showMWarningCancel && !this.showMWarningSave) {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case Enums.KeyBoard.Escape:
          this.closeForm();
          break;
        case Enums.KeyBoard.Enter:
          this.onSaveForm();
          break;
        default:
          break;
      }
      // }
    },
    /**
     *Hàm kiểm tra trùng mã
     *Author: TMNghia (18/4/2023)
     */
    isDuplicate(code, table, id) {
      axios
        .get(
          assetsAPI +
            "CheckCode?code=" +
            code +
            "&table=" +
            table +
            "&id=" +
            id,
          { headers: `Authorization: Bearer ${this.token}` }
        )
        .catch(this.handleError);
    },

    /**
     * Hàm check nguyên giá có tồn tại dấu "," không
     * Author: TMNghia 19/4/2023
     */
    checkAtrophy(val) {
      if (val) {
        if (val.split("")[val.length - 1] == ",") {
          return val.substring(0, val.length - 1);
        } else {
          return val;
        }
      }
    },
  },
  watch: {
    // Tự động điền tên bộ phận
    departmentIDChange: function (val) {
      for (let item of this.departments) {
        if (item.department_code == val) {
          this.elements.department_name = item.department_name;
          this.elements.department_id = item.department_id;
        }
      }
    },

    // Tự động điền tên loại tài sản
    categoryIDChange: function (val) {
      for (let item of this.categories) {
        if (item.fixed_asset_category_code == val) {
          this.elements.fixed_asset_category_name =
            item.fixed_asset_category_name;
          this.elements.fixed_asset_category_id = item.fixed_asset_category_id;
        }
      }
    },

    // Tự động điền tên năm theo dõi
    buyDateChange: function (val) {
      if (val) {
        let buyYear = val.split("-")[0];
        this.elements.tracked_year = buyYear * 1;
      }
    },

    // Tự động điền tên số năm sử dụng
    useDateChange: function (val) {
      if (val) {
        let useYear = val.split("-")[0];
        let today = new Date();
        let date = today.getFullYear();
        this.elements.life_time = date * 1 - useYear * 1;
      }
    },

    // Tự động điền giá trị hao mòn
    priceChange: function (val) {
      val = this.checkAtrophy(val);
      if (this.elements.depreciation_rate) {
        if (this.elements.quantity) {
          this.elements.atrophy = commonJS.formatMoney(
            (commonJS.unFormatMoney(val) *
              1 *
              commonJS.unFormatMoney(this.elements.quantity) *
              1 *
              this.unFormatRate(this.elements.depreciation_rate) *
              1) /
              100
          );
        } else {
          this.elements.atrophy = 0;
        }
      }
      if (!this.elements.atrophy) {
        this.elements.atrophy = 0;
      }
    },

    quantityChange: function (val) {
      if (this.elements.atrophy) {
        this.elements.atrophy = commonJS.formatMoney(
          (commonJS.unFormatMoney(val) *
            1 *
            this.unFormatRate(this.elements.depreciation_rate) *
            1 *
            commonJS.unFormatMoney(this.elements.cost) *
            1) /
            100
        );
      } else {
        this.elements.atrophy = 0;
      }
    },
  },

  data() {
    return {
      indexSelected: null,
      departmentShow: false,
      categoryShow: false,
      asset: {},
      elements: {},
      isCheckID: true,
      assets: [],
      warningShow: false,
      warningMessage: "",
      isOK: true,
      elementValues: [],
      ErrorElementArray: ErrorElements,
      invalidAsset: false,
      saveAssetSelected: null,
      getAssetUpdate: null,

      departmentIDChange: null,
      categoryIDChange: null,
      buyDateChange: null,
      useDateChange: null,
      ratioChange: null,
      priceChange: null,
      quantityChange: null,

      titleForm: null,
      showMWarningSave: false,
      showMWarningCancel: false,

      departments: null,
      categories: null,
      elementsValidate: {},
      errorMessage415: "Có lỗi xảy ra, vui lòng liên hệ trung tâm tư vấn!",
    };
  },
};
</script>

<style>
@import url(./FormPopup.css);
</style>
