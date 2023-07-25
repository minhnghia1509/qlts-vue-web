<template>
  <div class="popup">
    <div class="increment-form budget-form" v-ctrls="onSaveForm">
      <div class="increment-form-header">
        <p>Sửa tài sản {{ assetPicked.fixed_asset_name }}</p>
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
      <div class="budget-form-department">
        <p>Bộ phận sử dụng</p>
        <input
          type="text"
          readonly="true"
          v-model="department"
          class="increment-form-main-infor-input"
        />

        <div class="budget-form-detail">
          <p>Nguyên giá</p>
          <div class="budget-form-detail-header">
            <p class="budget-form-detail-header-source">Nguồn hình thành</p>
            <p class="budget-form-detail-header-cost">Giá trị</p>
          </div>
          <div class="budget-form-detail-list">
            <div class="budget-form-value" v-if="selectionList.length == 0">
              <div class="budget-form-detail-header-source"></div>
              <input
                type="text"
                class="budget-form-detail-header-cost border-none"
              />
              <div class="budget-form-action">
                <div class="budget-form-action-icon" @click="addSelectionList">
                  <MisaToolTip :content="'Thêm nguồn hình thành'">
                    <i class="icon-add-item"></i>
                  </MisaToolTip>
                </div>
              </div>
            </div>
            <div
              class="budget-form-value"
              v-for="(item, index) in selectionList"
              :key="index"
            >
              <div
                class="budget-form-detail-header-source budget-form-value-combobox"
              >
                <MCombobox
                  class=""
                  :placeholder="'Chọn vùng'"
                  :listItem="listItem"
                  :value="item.budget_source_name"
                  :indexCombobox="index"
                  :index="index"
                  :error="comboboxErrors[index]"
                  :flag="flag"
                  @changeValue="changeValue"
                  @changeStatus="changeStatus"
                  @click="
                    comboboxErrors[index] = false;
                    budgetDuplicate[index] = false;
                  "
                ></MCombobox>
                <p
                  class="text-red font-size-11px"
                  v-if="comboboxErrors[index] && !budgetDuplicate[index]"
                >
                  Không được bỏ trống ô này!
                </p>
                <p
                  class="text-red font-size-11px"
                  v-if="budgetDuplicate[index]"
                >
                  Đã trùng nguồn hình thành!
                </p>
              </div>
              <div
                class="budget-form-detail-header-cost-div budget-form-value-price"
              >
                <input
                  type="text"
                  class="align-right budget-form-detail-header-cost"
                  placeholder="Nhập giá"
                  v-model="item.price"
                  maxlength="19"
                  :class="{
                    'input-red': priceErrors[index],
                    'input-blue': !priceErrors[index],
                  }"
                  @input="onInputPrice(item, index)"
                  @blur="blurPrice(item.price, index)"
                />
                <p class="text-red font-size-11px" v-if="priceErrors[index]">
                  Không được bỏ trống ô này!
                </p>
              </div>
              <div class="budget-form-action">
                <div class="budget-form-action-icon" @click="addSelectionList">
                  <MisaToolTip :content="'Thêm nguồn hình thành'">
                    <i class="icon-add-item"></i>
                  </MisaToolTip>
                </div>
                <div class="budget-form-action-icon" @click="removeItem(index)">
                  <MisaToolTip :content="'Xoá nguồn hình thành'">
                    <i class="icon-remove-item"></i>
                  </MisaToolTip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="budget-form-detail-footer">
          <input
            class="budget-form-detail-header-source"
            :value="'Tổng'"
            readonly="true"
          />
          <input
            class="budget-form-detail-header-cost align-right"
            placeholder="0"
            :value="commonJS.formatMoneyN(totalPrice)"
            readonly="true"
          />
        </div>
      </div>
      <div class="increment-form-footer">
        <MisaToolTip :content="'Ctrl + S'">
          <button
            class="btn btn-blue increment-form-footer-save"
            @click="onSaveForm"
          >
            Lưu
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
    v-if="showMWarningDefault"
    :text="warningMessage"
    @closeWarning="showMWarningDefault = false"
  ></MWarningDefault>
</template>
<script>
import MisaToolTip from "../MisaToolTip/MisaToolTip.vue";
import MCombobox from "../MCombobox/MCombobox.vue";
import { getBudgetSource } from "../../helpers/api";
import commonJS from "@/helpers/common";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
export default {
  name: "BudgetForm",
  props: ["assetPicked", "budgetsSend"],
  components: { MCombobox, MisaToolTip, MWarningDefault },
  created() {
    getBudgetSource((rs) => {
      this.budgetSource = rs.data;
      this.filterBudgetData();
    });
    this.department = this.assetPicked.department_name;
    if (!this.budgetsSend || this.budgetsSend.length == 0) {
      this.selectionList = [
        {
          budget_id: "",
          budget_source_name: "",
          fixed_asset_id: this.assetPicked.fixed_asset_id,
          budget_source_id: "",
          price: 0,
          created_date: new Date(),
        },
      ];
    } else {
      this.selectionList = JSON.parse(JSON.stringify(this.budgetsSend));
      this.formatBudgetPrice();
    }
  },

  methods: {
    /**
     * Validate input
     * Author: TMNghia 01/07/2023
     */
    onInputPrice(item, index) {
      item.price = commonJS.formatMoney(commonJS.fNumber(item.price));
      this.blurPrice(item.price, index);
      item.is_updated = 1;
    },
    /**
     * Lưu form
     * Author: TMNghia 01/07/2023
     */
    onSaveForm() {
      event.preventDefault();
      if (this.validate()) {
        this.unFormatBudgetPrice();
        this.$emit("saveBudgetForm", this.selectionList);
      }
    },
    /**
     * Validate form
     * Author: TMNghia 01/07/2023
     */
    validate() {
      this.checkBudgetSource();
      for (let i = 0; i < this.selectionList.length; i++) {
        if (!this.selectionList[i].budget_source_name) {
          this.comboboxErrors[i] = true;
        }
        if (!this.selectionList[i].price) {
          this.priceErrors[i] = true;
        }
      }
      if (
        commonJS.filterArray(this.comboboxErrors).length == 0 &&
        commonJS.filterArray(this.priceErrors).length == 0 &&
        commonJS.filterArray(this.budgetDuplicate).length == 0
      ) {
        return true;
      }
      return false;
    },
    /**
     * Thay đổi trạng thái của ô nhập
     * Author: TMNghia 01/07/2023
     */
    changeStatus(inputRed, index) {
      this.comboboxErrors[index] = inputRed;
    },
    /**
     * Validate input giá
     * Author: TMNghia 01/07/2023
     */
    blurPrice(val, index) {
      if (!val) {
        this.priceErrors[index] = true;
      } else {
        this.priceErrors[index] = false;
      }
    },
    /**
     * Lọc danh sách nguồn hình thành
     * Author: TMNghia 01/07/2023
     */
    filterBudgetData() {
      for (let i = 0; i < this.budgetSource.length; i++) {
        this.listItem.push({
          id: this.budgetSource[i].budget_source_id,
          value: this.budgetSource[i].budget_source_name,
        });
      }
    },
    /**
     * Thay đổi giá trị combobox
     * Author: TMNghia 01/07/2023
     */
    changeValue(item, indexCombobox) {
      this.selectionList[indexCombobox].budget_source_id = item.id;
      this.selectionList[indexCombobox].budget_source_name = item.value;
      this.selectionList[indexCombobox].is_updated = 1;
    },
    /**
     * Xoá bản ghi
     * Author: TMNghia 01/07/2023
     */
    removeItem(index) {
      this.selectionList.splice(index, 1);
      this.comboboxErrors.splice(index, 1);
      this.priceErrors.splice(index, 1);
      this.budgetDuplicate.splice(index, 1);
    },
    /**
     * Thêm một nguồn hình thành mới
     * Author: TMNghia 01/07/2023
     */
    addSelectionList() {
      if (this.selectionList.length < 4) {
        this.selectionList.push({
          budget_id: "",
          budget_source_name: "",
          fixed_asset_id: this.assetPicked.fixed_asset_id,
          budget_source_id: "",
          price: 0,
          created_date: new Date(),
        });
        this.comboboxErrors.push(null);
        this.priceErrors.push(null);
      } else {
        this.warningMessage = "Bạn đã chọn 4 nguồn hình thành!";
        this.showMWarningDefault = true;
      }
    },
    /**
     * Format giá tiền
     * Author: TMNghia 01/07/2023
     */
    formatBudgetPrice() {
      for (let i = 0; i < this.selectionList.length; i++) {
        this.selectionList[i].price = commonJS.formatMoney(
          this.selectionList[i].price
        );
      }
    },
    /**
     * Huỷ format giá tiền
     * Author: TMNghia 01/07/2023
     */
    unFormatBudgetPrice() {
      for (let i = 0; i < this.selectionList.length; i++) {
        this.selectionList[i].price = commonJS.unFormatMoney(
          this.selectionList[i].price
        );
      }
    },
    /**
     * Kiểm tra trùng nguồn hình thành
     * Author: TMNghia 01/07/2023
     */
    checkBudgetSource() {
      for (let i = 0; i < this.selectionList.length; i++) {
        for (let j = i + 1; j < this.selectionList.length; j++) {
          if (
            this.selectionList[i].budget_source_id ==
              this.selectionList[j].budget_source_id &&
            this.selectionList[j].budget_source_id
          ) {
            this.comboboxErrors[j] = true;
            this.budgetDuplicate[j] = true;
          }
        }
      }
      this.budgetSource = commonJS.filterArray(this.budgetSource);
    },
  },
  data() {
    return {
      selectionList: [
        {
          budget_id: "",
          budget_source_name: "",
          fixed_asset_id: this.assetPicked.fixed_asset_id,
          budget_source_id: "",
          price: 0,
          created_date: new Date(),
        },
      ],
      budgetDuplicate: [],
      priceErrors: [],
      budgetSource: [],
      listItem: [],
      department: "a",
      comboboxErrors: [],
      flag: false,
      showMWarningDefault: false,
      warningMessage: "",
    };
  },
  computed: {
    totalPrice() {
      try {
        let total = 0;
        for (let i = 0; i < this.selectionList.length; i++) {
          total += commonJS.unFormatMoney(this.selectionList[i].price) * 1;
        }
        if (!isNaN(total)) {
          return total;
        } else {
          return 0;
        }
      } catch {
        return 0;
      }
    },
  },
};
</script>
<style>
@import url("./BudgetForm.css");
</style>
