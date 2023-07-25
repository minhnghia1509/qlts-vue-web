<template>
  <div
    class="main-content"
    @click="
      showCategoryList = false;
      showDepartmentList = false;
      showPageSize = false;
    "
  >
    <div class="action">
      <div class="action-filter">
        <div class="action-filter-search">
          <div class="action-filter-search-icon">
            <i class="icon-search"></i>
          </div>
          <input
            type="text"
            class="action-filter-search-type"
            placeholder="Tìm kiếm tài sản"
            v-model="keySearch"
          />
        </div>
        <div class="action-filter-category">
          <div class="action-filter-category-icon">
            <div class="icon-category"></div>
          </div>
          <input
            type="text"
            class="action-filter-search-type"
            placeholder="Chọn mã loại tài sản"
            v-model="chooseCategories"
            readonly="true"
            @click="$event.stopPropagation()"
            @focus="
              {
                showCategoryList = true;
                showDepartmentList = false;
              }
            "
          />
          <div
            class="action-filter-category-down"
            @click="
              $event.stopPropagation();
              showCategoryList = true;
              showDepartmentList = false;
            "
          >
            <i class="icon-down"></i>
          </div>
          <ul class="list-item fixed_asset_category" v-show="showCategoryList">
            <li
              v-for="(item, index) in categories"
              class="dropdown-item"
              :key="index"
              @click="clickItemCategory(index)"
            >
              <input
                type="checkbox"
                class="dropdown-checkbox"
                v-model="checkCategories[index]"
              />
              <p class="dropdown-name">{{ item.fixed_asset_category_name }}</p>
            </li>
          </ul>
        </div>
        <div class="action-filter-department">
          <div class="action-filter-department-icon">
            <i class="icon-category"></i>
          </div>
          <input
            type="text"
            class="action-filter-search-type"
            placeholder="Chọn mã bộ phận"
            readonly="true"
            v-model="chooseDepartments"
            @click="$event.stopPropagation()"
            @focus="
              {
                showCategoryList = false;
                showDepartmentList = true;
              }
            "
          />
          <div
            class="action-filter-department-down"
            @click="
              $event.stopPropagation();
              showCategoryList = false;
              showDepartmentList = true;
            "
          >
            <i class="icon-down"></i>
          </div>
          <ul
            class="list-item fixed_asset_department"
            v-show="showDepartmentList"
          >
            <li
              v-for="(item, index) in departments"
              class="dropdown-item"
              :key="index"
              @click="clickItemDepartment(index)"
            >
              <input
                type="checkbox"
                class="dropdown-checkbox"
                v-model="checkDepartments[index]"
              />
              <p class="dropdown-name">{{ item.department_name }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="action-buttons">
        <button
          class="btn action-buttons-add tooltip"
          v-on:click="formAdd"
          @focus="showDepartmentList = false"
        >
          <p>+ Thêm tài sản</p>
          <span class="tooltiptext">Tạo mới</span>
        </button>
        <div href="" class="action-buttons-export">
          <i class="icon-edit"></i>
        </div>
        <div
          href=""
          class="action-buttons-delete"
          @click="deleteAssets"
          ref="btnDelete"
          :class="{ 'disabled-btn tooltip': enabledBtnDelete }"
        >
          <i class="icon-delete"></i>
          <span class="display-none" :class="{ tooltiptext: enabledBtnDelete }"
            >Xoá tài sản</span
          >
        </div>
      </div>
    </div>

    <div class="row data-tables">
      <table>
        <thead>
          <tr class="data-tables-heading">
            <th width="5%" class="item-align-center">
              <input
                type="checkbox"
                class="data-tables-check-box"
                @click="allSelected"
                v-model="checkAll"
              />
            </th>
            <th width="5%" class="td-tooltip">
              STT
              <span class="td-tooltiptext">Số thứ tự</span>
            </th>
            <th width="7%">Mã tài sản</th>
            <th>Tên tài sản</th>
            <th>Loại tài sản</th>
            <th>Bộ phận sử dụng</th>
            <th class="align-right" width="5%">Số lượng</th>
            <th class="align-right" width="10%">Nguyên giá</th>
            <th class="align-right td-tooltip" width="10%">
              KH/HM Luỹ kế
              <span class="td-tooltiptext">Khấu hao/ hao mòn luỹ kế</span>
            </th>
            <th class="align-right" width="10%">Giá trị còn lại</th>
            <th class="data-tables-heading-action" width="7%">
              <p>Chức năng</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in assets"
            :key="index"
            @dblclick="rowOnDblClick(item)"
            :class="{ 'selected-item': isSelected(item, checkItems) }"
            @contextmenu="onClickContextMenu(index, item)"
          >
            <td width="5%" class="item-align-center">
              <input
                type="checkbox"
                :value="item"
                class="data-tables-check-box"
                v-model="checkItems"
                @dblclick="checkBoxOnDblClick()"
                @click.ctrl="onControlClick(index)"
              />
            </td>
            <td width="5%">{{ index + 1 }}</td>
            <td width="7%">{{ item.fixed_asset_code }}</td>
            <td class="overflow-ellipsis td-tooltip">
              {{ item.fixed_asset_name }}
              <div class="td-tooltiptext">{{ item.fixed_asset_name }}</div>
            </td>
            <td>{{ item.fixed_asset_category_name }}</td>
            <td>{{ item.department_name }}</td>
            <td class="align-right" width="5%">{{ item.quantity }}</td>
            <td class="align-right" width="10%">
              {{ commonJS.formatMoneyN(item.cost) }}
            </td>
            <td class="align-right" width="10%">
              {{
                commonJS.formatMoneyN(
                  item.cost * (item.depreciation_rate / 100) * item.quantity
                )
                  ? commonJS.formatMoneyN(
                      item.cost * (item.depreciation_rate / 100) * item.quantity
                    )
                  : 0
              }}
            </td>
            <td class="align-right" width="10%">
              {{
                commonJS.formatMoneyN(
                  ((item.cost * (100 - item.depreciation_rate)) / 100) *
                    item.quantity
                )
                  ? commonJS.formatMoneyN(
                      ((item.cost * (100 - item.depreciation_rate)) / 100) *
                        item.quantity
                    )
                  : 0
              }}
            </td>
            <td width="7%">
              <div class="data-tables-action">
                <div
                  class="icon-pen data-tables-action-icon-pen tooltip"
                  @click="onClickUpdate(item)"
                  @dblclick="checkBoxOnDblClick()"
                >
                  <span class="tooltiptext pen-tooltiptext">Sửa</span>
                </div>
                <div
                  class="icon-copy data-tables-action-icon-copy tooltip"
                  @dblclick="checkBoxOnDblClick()"
                  @click="onClickCopy(item)"
                >
                  <span class="tooltiptext copy-tooltiptext">Sao chép</span>
                </div>
              </div>
            </td>
          </tr>
          <ul
            class="data-tables-item-menu-context"
            v-show="true"
            ref="tablesContextMenu"
            v-outSide="disableContextMenu"
          >
            <li @click="menuContextAdd"><i class="icon-add"></i>Thêm mới</li>
            <li @click="menuContextEdit"><i class="icon-edit"></i>Sửa</li>
            <li @click="menuContextDelete">
              <i class="icon-delete-black"></i>Xoá
            </li>
            <li @click="menuContextCopy"><i class="icon-copy"></i>Nhân bản</li>
          </ul>
      <ProgressBar v-if="showProgressBar"></ProgressBar>

        </tbody>

        <tr class="data-tables-tr-footer">
          <td colspan="6">
            <div class="data-tables-footer">
              <div class="data-tables-footer-total">
                Tổng số:
                <span class="text-bold">{{ totalRecords }}</span>
                bản ghi
              </div>
              <div class="data-tables-footer-select">
                <input
                  v-model="pageSize"
                  class="data-tables-footer-page-size"
                  @focus="showPageSize = true"
                  readonly="true"
                  @click="$event.stopPropagation()"
                />
                <i class="icon-down"></i>
                <ul class="list-page-size" v-if="showPageSize">
                  <li
                    class="page-size-item"
                    v-for="(item, index) in listPageSize"
                    :key="index"
                    @click="
                      pageSize = item;
                      showPageSize = false;
                      currentPage = 1;
                      GetAssetFilter();
                    "
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <ul class="data-tables-footer-page-number">
                <li
                  class="data-tables-footer-page-number-item"
                  @click="changePage('prev')"
                >
                  <i class="icon-left"></i>
                </li>
                <li
                  v-for="(item, index) in pages"
                  :key="index"
                  class="data-tables-footer-page-number-item"
                  :class="{ 'current-page': item == currentPage }"
                  @click="changePage(item)"
                >
                  {{ item }}
                </li>
                <li
                  class="data-tables-footer-page-number-item"
                  @click="changePage('next')"
                >
                  <i class="icon-right"></i>
                </li>
              </ul>
            </div>
          </td>
          <td
            class="align-right text-bold"
            id="data-tables-total-quantity"
            width="5%"
          >
            <p class="padding-right">
              {{ commonJS.formatMoneyN(footerValues.totalQuantity) }}
            </p>
          </td>
          <td
            class="align-right text-bold"
            id="data-tables-total-price"
            width="10%"
          >
            <p class="padding-right">
              {{ commonJS.formatMoneyN(footerValues.totalPrice) }}
            </p>
          </td>
          <td
            class="align-right text-bold"
            id="data-tables-total-ratio"
            width="10%"
          >
            <p class="padding-right">
              {{ commonJS.formatMoneyN(footerValues.totalRatio) }}
            </p>
          </td>
          <td
            class="align-right text-bold"
            id="data-tables-total-price-left"
            width="10%"
          >
            <p class="padding-right">
              {{ commonJS.formatMoneyN(footerValues.totalPriceLeft) }}
            </p>
          </td>
          <td width="7%"></td>
        </tr>
      </table>
    </div>

    <MWarningDelete
      v-if="showWarningDelete"
      :text="deleteText"
      @closeMWarningDelete="showWarningDelete = false"
      @onDelete="confirmDelete"
    ></MWarningDelete>

    <FormPopup
      :itemSelected="assetSelected"
      :formMode="formModeChoose"
      v-if="isShowForm"
      @onCloseForm="closeForm()"
      @onSuccessForm="showToastMessage()"
      @onOnlyCloseForm="onlyCloseForm()"
      :token="token"
    ></FormPopup>

    <ToastMessage
      v-if="showToast"
      :toastMessageText="toastMessageText"
    ></ToastMessage>
    <MWarningDefault
      :text="warningMessage"
      v-if="warningShow"
      @closeWarning="warningShow = false"
    ></MWarningDefault>
  </div>
  <WarningDeleteAsset
    v-if="showWarningDeleteAsset"
    :listData="listData"
    @closeWarning="showWarningDeleteAsset = false; showWarningDelete = false"
  ></WarningDeleteAsset>
</template>

<script>
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import ToastMessage from "../ToastMessage/ToastMessage.vue";
import MWarningDelete from "../MWarningDelete/MWarningDelete.vue";
import Enums from "../../helpers/enum.js";
import FormPopup from "../FormPopup/FormPopup.vue";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import { getAllAsset, multiDeleteAssets } from "@/helpers/api";
import WarningDeleteAsset from "../WarningDeleteAsset.vue";
import axios from "axios";

export default {
  name: "DataTable",
  components: {
    FormPopup,
    MWarningDelete,
    ToastMessage,
    ProgressBar,
    MWarningDefault,
    WarningDeleteAsset,
  },
  props: ["token"],

  // Đổ dữ liệu
  created() {
    try {
      this.GetAssets(this.GetAllAssets);
      this.GetDepartments();
      this.GetCategories();
      this.GetAssetFilter();

      this.department_id = "00000000-0000-0000-0000-000000000000";
      this.fixed_asset_category_id = "00000000-0000-0000-0000-000000000000";

      if (this.assets.length > 0) {
        this.enabledBtnDelete = true;
      } else {
        this.enabledBtnDelete = false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  updated() {
    if (this.assets.length > 0) {
      this.enabledBtnDelete = true;
    } else {
      this.enabledBtnDelete = false;
    }
  },

  methods: {
    /**
     * Các hàm xử lý menucontext
     * Author: TMNghia 13/05/2023
     */
    menuContextAdd() {
      this.disableContextMenu();
      this.formAdd();
    },
    menuContextEdit() {
      this.disableContextMenu();
      this.rowOnDblClick(this.assetRightClick);
    },
    menuContextDelete() {
      this.disableContextMenu();
      this.checkItems.push(this.assetRightClick);
      this.deleteAssets();
    },
    menuContextCopy() {
      this.disableContextMenu();
      this.onClickCopy(this.assetRightClick);
    },

    /**
     * Hàm xử lý hiện menucontext
     */
    onClickContextMenu() {
      event.preventDefault();
      // this.$refs.tablesContextMenu.style.top = (20 + index*40.8) + "px";
      // this.$refs.tablesContextMenu.style.left = (event.pageX - 80) + "px";
      // this.assetRightClick = item;
    },

    /**
     * Hàm ẩn context menu
     */
    disableContextMenu() {
      this.$refs.tablesContextMenu.style.top = "-200px";
    },

    /**
     * Hàm xử lý chọn nhiều bằng control
     * Author: TMNghia 05/05/2023
     */
    onControlClick(index) {
      let mark = -1;
      let check = false;
      if (this.checkItems.length > 0) {
        for (let i = 0; i < this.assets.length; i++) {
          if (this.isIn(this.assets[i], this.checkItems)) {
            mark = i;
            check = true;
          }
          if (i > mark && mark != -1 && i <= index) {
            this.checkItems.push(this.assets[i]);
          }
        }
      } else if (this.checkItems.length == 0 || check == false) {
        for (let i = 0; i < this.assets.length; i++) {
          if (i <= index) {
            this.checkItems.push(this.assets[i]);
          }
        }
      }
    },

    /**
     * Hàm kiểm tra phần tử có thuộc mảng không
     * Author: TMNghia 05/05/2023
     */
    isIn(item, array) {
      for (let i = 0; i < array.length; i++) {
        if (item === array[i]) {
          return true;
        }
      }
      return false;
    },
    /**
     * Hàm xoá tài sản
     * Author: TMNghia 25/3/2023
     */
    allSelected() {
      this.checkAll = !this.checkAll;
      this.checkItems = [];
      if (this.checkAll) {
        this.checkItems = this.assets;
        // this.selectedItems = this.assets;
      }
    },

    /**
     * Hàm lưu tài sản được chọn
     * Author: TMNghia 25/3/2023
     */
    checkItem(item, index) {
      if (this.checkItems.includes(item)) {
        this.checkItems = this.checkItems.filter(function (value) {
          if (value != item) {
            return value;
          }
        });
      } else {
        this.checkItems.push(item);
      }

      this.selectedItems[index] = !this.selectedItems[index];
    },

    /**
     * Hàm xoá những tài sản đã chọn
     * Author: TMNghia 25/3/2023
     */
    confirmDelete() {
      let listID = [];
      this.checkItems.forEach((item) => {
        listID.push(item.fixed_asset_id);
      });
      this.deleteAsset(listID);
    },

    /**
     * Hàm hiển thị cảnh báo xoá tài sản
     * Author: TMNghia 25/3/2023
     */
    deleteAssets() {
      if (this.enabledBtnDelete) {
        if (this.checkItems.length > 0) {
          if (this.checkItems.length > 1) {
            this.deleteText = ` ${this.checkItems.length} tài sản đã được chọn. Bạn có muốn xoá các tài sản này khỏi danh sách?`;
          } else {
            this.checkItems.forEach((item) => {
              this.deleteText = ` Bạn có muốn xoá tài sản ${item.fixed_asset_code} khỏi danh sách?`;
            });
          }
          this.showWarningDelete = true;
        }
      }
    },

    /**
     * Hàm click nút update
     * Author: TMNghia 25/3/2023
     */
    onClickUpdate(item) {
      event.stopPropagation();
      this.rowOnDblClick(item);
    },

    /**
     * Hàm nhân bản tài sản
     * Author: TMNghia 18/4/2023
     */
    onClickCopy(item) {
      event.stopPropagation();
      this.isShowForm = true;
      this.assetSelected = item;
      this.formModeChoose = Enums.FormMode.Copy;
    },

    /**
     * Phương thức xoá tài sản
     * Author: TMNghia 25/3/2023
     */
    deleteAsset(listID) {
      multiDeleteAssets(
        listID,
        () => {
          this.showWarningDelete = false;
          this.keySearch = "";
          // this.GetAssetFilter();
          this.toastMessageText = "Xoá thành công!";
          this.showToastMessage();
          this.checkItems = [];
        },
        (error) => {
          this.showWarningDelete = false;
          if (error.response.status == 404 || error.response.status == 400) {
            this.listData = error.response.data;
            this.showWarningDeleteAsset = true;
          }
        }
      );
    },

    /**
     * Hàm hứng thông báo lỗi từ server
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
     * Phương thức gọi tài sản
     * Author: TMNghia 25/3/2023
     */
    GetAssets(callback) {
      getAllAsset(callback, this.handleError);
    },

    /**
     * Hàm render dữ liệu
     * Author: TMNghia(25/3/2023)
     */
    RenderAssets(res) {
      this.assets = res.data;
      this.FooterTotal(res.data);
      this.showProgressBar = false;
      this.totalRecords = this.assets.length;
    },

    /**
     * Hàm lưu tất cả dữ liệu
     * Author: TMNghia(25/3/2023)
     */
    GetAllAssets(res) {
      this.allRecords = res.data;
      this.showProgressBar = false;
    },
    /**
     * Hàm tính tổng cho chân bảng
     * Author: TMNghia (25/3/2023)
     */
    FooterTotal(assets) {
      this.footerValues = {
        totalQuantity: 0,
        totalPrice: 0,
        totalRatio: 0,
        totalPriceLeft: 0,
      };
      assets.forEach((asset) => {
        this.footerValues.totalQuantity += asset.quantity * 1;
        this.footerValues.totalPrice += asset.cost * 1 * asset.quantity * 1;
        this.footerValues.totalRatio +=
          (asset.cost * 1 * asset.depreciation_rate * 1 * asset.quantity * 1) /
          100;
      });
      this.footerValues.totalPriceLeft =
        this.footerValues.totalPrice * 1 -
        (this.footerValues.totalRatio * 1) / 100;
    },
    /**
     * Hàm double click
     * Author: TMNghia(30/3/2023)
     */
    rowOnDblClick(item) {
      this.isShowForm = true;
      this.assetSelected = item;
      this.formModeChoose = Enums.FormMode.Update;
    },
    /**
     * Hàm huỷ sự kiện cha ở checkbox
     * Author: TMNghia 25/3/2023
     */
    checkBoxOnDblClick() {
      event.stopPropagation();
    },
    /**
     * Mở form thêm mới
     * Author: TMNghia 25/3/2023
     */
    formAdd() {
      this.formModeChoose = Enums.FormMode.Add;
      this.isShowForm = true;
    },

    /**
     * Hàm hiển thị thông báo thành công
     */
    showToastMessage() {
      this.showWarningDelete = false;
      this.showToast = true;
      this.toastMessageText = 'Lưu dữ liệu thành công!'
      this.GetAssetFilter();
      setTimeout(() => (this.showToast = false), 3000);
      this.selectedItems = [];
    },

    /**
     * Hàm đóng form
     */
    closeForm() {
      this.checkItems = [];
      this.isShowForm = false;
      this.keySearch = "";
    },
    onlyCloseForm() {
      this.isShowForm = false;
    },
    /**
     * Hàm render dữ liệu bộ phận
     * Author: TMNghia(13/4/2023)
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
     * Hàm render chọn dữ liệu bộ phận
     * Author: TMNghia(13/4/2023)
     */
    clickItemDepartment(index) {
      if (this.checkDepartments[index]) {
        this.checkDepartments[index] = false;
      } else {
        this.checkDepartments[index] = true;
      }
      let count = 0;
      for (let i = 0; i < this.checkDepartments.length; i++) {
        if (this.checkDepartments[i] == true) {
          count++;
        }
      }
      if (count == 0) {
        this.chooseDepartments = null;
      } else {
        this.chooseDepartments = "Đã chọn " + count + " bộ phận";
      }
      this.currentPage = 1;
      this.GetAssetFilter();
    },

    /**
     * Hàm render dữ liệu loại
     * Author: TMNghia(13/4/2023)
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
     * Hàm render chọn dữ liệu loại
     * Author: TMNghia(13/4/2023)
     */
    clickItemCategory(index) {
      if (this.checkCategories[index]) {
        this.checkCategories[index] = false;
      } else {
        this.checkCategories[index] = true;
      }
      let count = 0;
      for (let i = 0; i < this.checkCategories.length; i++) {
        if (this.checkCategories[i] == true) {
          count++;
        }
      }
      if (count == 0) {
        this.chooseCategories = null;
      } else {
        this.chooseCategories = "Đã chọn " + count + " loại";
      }
      this.currentPage = 1;
      this.GetAssetFilter();
    },

    /**
     * Hàm filter dữ liệu
     */
    GetAssetFilter() {
      this.checkAll = false;
      let api = "";
      if (this.keySearch) {
        api =
          api +
          "https://localhost:44375/api/FixedAssets/Filter?keyword=" +
          this.keySearch;
      } else {
        api =
          api + "https://localhost:44375/api/FixedAssets/Filter?keyword=" + "none";
      }
      api = api + "&departmentIDs=" + this.GetDepartmentIDs();
      api = api + "&categoryIDs=" + this.GetCategoryIDs();
      api = api + "&pageSize=" + this.pageSize;
      api = api + "&currentPage=" + this.currentPage;
      axios
        .get(api, {
          headers: `Authorization: Bearer ${this.token}`,
        })
        .then((response) => {
          this.assets = response.data.data;
          this.FooterTotal(response.data.data);
          this.totalRecords = response.data.totalRecord;
        })
        .catch(this.handleError);
    },

    /**
     * Hàm lấy danh sách ID bộ phận đã chọn
     * Author: TMNghia 10/05/2023
     */
    GetDepartmentIDs() {
      let listDepartmentID = "";
      for (const [key, value] of Object.entries(this.checkDepartments)) {
        if (value) {
          listDepartmentID =
            listDepartmentID + this.departments[key].department_id + "/";
        }
      }
      if (listDepartmentID == "") {
        return "00000000-0000-0000-0000-000000000000";
      } else {
        return listDepartmentID;
      }
    },
    /**
     * Hàm lấy danh sách ID loại đã chọn
     * Author: TMNghia 10/05/2023
     */
    GetCategoryIDs() {
      let listCategoryID = "";
      for (const [key, value] of Object.entries(this.checkCategories)) {
        if (value) {
          listCategoryID =
            listCategoryID + this.categories[key].fixed_asset_category_id + "/";
        }
      }
      if (listCategoryID == "") {
        return "00000000-0000-0000-0000-000000000000";
      } else {
        return listCategoryID;
      }
    },

    /**
     * Hàm theo dõi thay đổi giá trị của trang
     * Author: TMNghia 25/4/2023
     */
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

      this.GetAssetFilter();
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
     * Hàm theo dõi bản ghi được chọn
     * Author: TMNghia 25/4/2023
     */
    isSelected(value, array) {
      for (let i = 0; i < array.length; i++) {
        if (value == array[i]) {
          return true;
        }
      }
      return false;
    },
  },

  watch: {
    /**
     * Theo dõi nhập ô tìm kiếm
     */
    keySearch() {
      this.currentPage = 1;
      this.GetAssetFilter();
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
      toastMessageText: "",
      showMenuContext: false,
      lastCategory: false,
      lastDepartment: false,
      showCategoryList: false,
      showDepartmentList: false,
      allRecords: null,
      keySearch: "",
      department_id: "",
      fixed_asset_category_id: "",
      categories: [],
      departments: [],
      reMountTable: true,
      showProgressBar: false,
      showToast: false,
      deleteText: "",
      showWarningDelete: false,
      checkItems: [],
      selectedItems: [],
      assets: [],
      footerValues: {},
      isShowForm: false,
      assetSelected: {},
      checkAll: false,
      formModeChoose: Number,
      enabledBtnDelete: true,
      checkDepartments: [],
      checkCategories: [],
      pageSize: 20,
      totalRecords: 0,
      currentPage: 1,
      listPageSize: [10, 20, 30, 40, 50],
      showPageSize: false,
      chooseCategories: "",
      chooseDepartments: "",
      warningMessage: "",
      warningShow: false,
      assetRightClick: null,
      errorMessage415: "Có lỗi xảy ra, vui lòng liên hệ trung tâm tư vấn!",
      showWarningDeleteAsset: false,
      listData: [],
    };
  },
};
</script>

<style>
@import url(./MainContent.css);
</style>
