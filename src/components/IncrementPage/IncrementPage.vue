<template>
  <div
    class="increment-page-wrapper"
    @mouseup="onPull = false"
    @mousemove="pullTable"
  >
    <div class="increment-page-header">
      <h3>Ghi tăng tài sản</h3>
      <div class="increment-page-header-action">
        <MisaToolTip :content="'Thêm mới chứng từ'">
          <button
          class="btn btn-blue increment-page-header-action-add"
          @click="showFormAdd"
          tabindex="2"
        >
          Thêm
        </button>
        </MisaToolTip>
        <div
          class="increment-page-header-action-view"
          @click="showListView = !showListView"
          v-outSide="
            (event) => {
              showListView = false;
            }
          "
        >
          <div class="action-view-type">
            <i class="icon-view-1" v-if="view"></i>
            <i class="icon-view-2" v-if="!view"></i>
          </div>
          <div class="action-view-choose">
            <MisaToolTip :content="'Chọn giao diện'">
              <i class="icon-arrow-down-black"></i>
            </MisaToolTip>
          </div>

          <ul class="action-view-list" v-if="showListView">
            <li class="action-view-list-item" @click="clickView(1)">
              <i class="icon-view-1"></i>
              <p>Giao diện ngang</p>
            </li>
            <li class="action-view-list-item" @click="clickView(2)">
              <i class="icon-view-2"></i>
              <p>Giao diện dọc</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="increment-page-main-action">
      <div class="main-action-search action-filter-search">
        <div class="action-filter-search-icon">
          <i class="icon-search"></i>
        </div>
        <input
          type="text"
          class="main-action-search-input action-filter-search-type"
          placeholder="Tìm kiếm theo số chứng từ, nội dung"
          v-model="keyword"
          @focus="isTyping = true"
          @blur="isTyping = false"
          v-enter="searchIncrement"
          tabindex="1"
        />
      </div>
      <div class="main-action-act">
        <div class="main-action-delete"  @click="deleteIncrements">
          <MisaToolTip :content="'Xoá chứng từ'">
          <i class="icon-delete"></i>
        </MisaToolTip>
        </div>
        <div class="main-action-export">
          <i class="icon-export"></i>
        </div>
        <div class="main-action-options">
          <i class="icon-options"></i>
        </div>
      </div>
    </div>
    <div class="increment-detail-table">
      <IncrementTable
        @updateSuccess="updateSuccess"
        @deleteItem="deleteItem"
        :reloadTable="reloadTable"
        :deleteFlash="deleteFlash"
        :dataTableMainHeight="dataTableMainHeight"
        :dataTableMainOffsetHeight="dataTableMainOffsetHeight"
        :token="token"
        :reloadUpdate="reloadUpdate"
        :keyword="keyword"
        :onSearch="onSearch"
        :reload="reload"
        @menuContextAdd="menuContextAdd"
        @pickIncrements="pickIncrements"
        @getCheckedItems="getCheckedItems"
      ></IncrementTable>
      <div class="increment-data-table-split"></div>
      <div class="increment-data-table-asset" ref="incrementAssetTable">
        <div
          class="increment-data-table-pull-icon"
          @mousedown="onMouseDownPull"
        >
          <i class="icon-pull"></i>
        </div>

        <div class="increment-data-table-asset-header">
          <p>Thông tin chi tiết</p>
          <div class="increment-data-table-asset-header-zoom" @click="zoomPage">
            <MisaToolTip :content="'Thu nhỏ'">
              <i class="icon-zoom-out" v-if="zoom"></i>
            </MisaToolTip>
            <MisaToolTip :content="'Phóng to'">
              <i class="icon-zoom-in" v-if="!zoom"></i>
            </MisaToolTip>
          </div>
        </div>

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
                <th class="align-right padding-right-8px">Giá trị còn lại</th>
              </tr>
            </thead>
          </table>
        </div>
        <div
          class="increment-data-table-asset-main increment-data-table-asset-main-data"
          ref="assetTableData"
        >
          <table>
            <tr v-for="(item, index) in listAssets" :key="index">
              <td width="5%" class="align-center-number">{{ index + 1 }}</td>
              <td><MisaToolTip :content="item.fixed_asset_code">
              {{ item.fixed_asset_code }}</MisaToolTip></td>
              <td><MisaToolTip :content="item.fixed_asset_name">{{ item.fixed_asset_name }}</MisaToolTip></td>
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
          </table>
        </div>
      </div>
    </div>

    <ProgressBar v-if="showProgressBar"></ProgressBar>
  </div>
  <IncrementForm
    :formMode="formMode"
    @insertSuccess="insertSuccess"
    v-if="showIncrementForm"
    @closeForm="
      (event) => {
        this.showIncrementForm = false;
      }
    "
    :token="token"
  ></IncrementForm>
  <MWarningDelete
    v-if="showWarningDelete"
    :text="deleteText"
    @closeMWarningDelete="showWarningDelete = false"
    @onDelete="confirmDelete"
  ></MWarningDelete>
  <ToastMessage
    v-if="showToastMessage"
    :toastMessageText="toastMessageText"
  ></ToastMessage>

  <MWarningDefault
    :text="warningMessage"
    v-if="warningShow"
    @closeWarning="
      (event) => {
        warningShow = false;
        showWarningDelete = false;
      }
    "
  ></MWarningDefault>
</template>
<script>
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import MWarningDefault from "../MWarningDefault/MWarningDefault.vue";
import ToastMessage from "../ToastMessage/ToastMessage.vue";
import MWarningDelete from "../MWarningDelete/MWarningDelete.vue";
import MisaToolTip from "../MisaToolTip/MisaToolTip.vue";
import IncrementTable from "../IncrementTable/IncrementTable.vue";
import IncrementForm from "../IncrementForm/IncrementForm.vue";
import commonJS from "@/helpers/common";
import Enums from "@/helpers/enum";
import { Message } from "@/helpers/resource";
import { deleteIncrementsApi, getAssetOfIncrement } from "../../helpers/api.js";
export default {
  components: {
    IncrementTable,
    IncrementForm,
    MisaToolTip,
    MWarningDelete,
    ToastMessage,
    MWarningDefault,
    ProgressBar,
  },
  props: ["token", "reload"],
  name: "IncrementPage",
  mounted() {
    this.$refs.assetTableData.style.maxHeight =
      "calc(100vh - " +
      (400 +
        document.querySelector(".increment-data-table-main").offsetHeight) +
      "px)";
  },
  methods: {
    menuContextAdd() {
      this.showFormAdd();
    },

    /**
     * Sửa thành công
     * Author: TMNghia 01/07/2023
     */
    updateSuccess() {
      this.toastMessage(Message.updateSuccess);
    },
    /**
     * Thêm mới thành công
     * Author: TMNghia 01/07/2023
     */
    insertSuccess() {
      this.showIncrementForm = false;
      this.reloadTable = !this.reloadTable;
      this.toastMessage(Message.insertSuccess);
    },
    /**
     * Lấy danh sách chứng từ đã chọn
     * Author: TMNghia 01/07/2023
     */
    getCheckedItems(checkedItems) {
      this.listIncrements = checkedItems;
    },
    /**
     * Xoá chứng từ trên dòng
     * Author: TMNghia 01/07/2023
     */
    deleteItem(item) {
      this.incrementDelete = item;
      this.deleteText = Message.deleteOneIncrement + " " + this.incrementDelete.fixed_asset_increment_code + "?";
      this.showWarningDelete = true;
    },
    /**
     * Xoá nhiều chứng từ
     * Author: TMNghia 01/07/2023
     */
    deleteIncrements() {
      if (this.listIncrements.length == 0) { //Nếu chưa chọn chứng từ nào
        this.warningMessage = Message.deleteRequest;
        this.warningShow = true;
      } else if (this.listIncrements.length == 1) { //Nếu chọn 1 chứng từ
        this.deleteText = Message.deleteOneIncrement + " " + this.listIncrements[0].fixed_asset_increment_code + "?";
        this.showWarningDelete = true;
      } else { //Chọn nhiều chứng từ
        this.deleteText = this.listIncrements.length + Message.deleteIncrements;
        this.showWarningDelete = true;
      }
    },
    /**
     * Xác nhận xoá chứng từ
     * Author: TMNghia 01/07/2023
     */
    confirmDelete() {
      this.showProgressBar = true;
      let list = [];
      if (this.incrementDelete) {
        list.push(this.incrementDelete.fixed_asset_increment_id);
      } else {
        for (let i = 0; i < this.listIncrements.length; i++) {
          list.push(this.listIncrements[i].fixed_asset_increment_id);
        }
      }
      //Gọi API xoá
      deleteIncrementsApi(
        list,
        () => {
          this.showProgressBar = false;
          this.reloadTable = !this.reloadTable;
          this.showWarningDelete = false;
          this.showToastMessage = true;
          this.incrementDelete = null;
          this.listAssets = null;
          this.listIncrements = [];
          this.keyword = "";
          this.toastMessage(Message.deleteSuccess);
        },
        (error) => {
          this.showProgressBar = false;
          this.warningMessage = commonJS.handleError(error);
          this.warningShow = true;
        }
      );
    },
    /**
     * Focus chứng từ
     * Author: TMNghia 01/07/2023
     */
    pickIncrements(id) {
      this.listID = [];
      this.listID.push(id);
      this.showProgressBarDetail = true;
      //Gọi API lấy dữ liệu những tài sản của chứng từ đã chọn
      getAssetOfIncrement(this.listID, (res) => {
        this.showProgressBarDetail = false;
        this.listAssets = res.data;
      });
    },
    /**
     * Mở form thêm mới
     * Author: TMNghia 01/07/2023
     */
    showFormAdd() {
      this.formMode = Enums.FormMode.Add;
      this.showIncrementForm = true;
    },
    /**
     * Tìm kiếm chứng từ
     * Author: TMNghia 01/07/2023
     */
    searchIncrement() {
      if (this.isTyping == true) {
        this.onSearch = !this.onSearch;
      }
    },
    /**
     * Kéo thả
     * Author: TMNghia 01/07/2023
     */
    pullTable(e) {
      if (this.onPull == true) {
        this.dataTableMainHeight = this.currentHeight + e.pageY - this.y + "px";
        this.tradeH = document.querySelector(
          ".increment-data-table-main"
        ).offsetHeight;
        this.$refs.assetTableData.style.maxHeight =
          "calc(100vh - " +
          (400 +
            (this.currentHeight + e.pageY - this.y >= 0
              ? this.currentHeight + e.pageY - this.y
              : 0)) +
          "px)";
      }
    },
    /**
     * Bấm nút kép
     * Author: TMNghia 01/07/2023
     */
    onMouseDownPull(e) {
      this.onPull = true;
      this.y = e.pageY;
      this.currentHeight = document.querySelector(
        ".increment-data-table-main"
      ).offsetHeight;
    },
    /**
     * Dừng kéo thả
     * Author: TMNghia 01/07/2023
     */
    onMouseUpPull(e) {
      this.onPull = false;
      this.y = e.pageY;
    },
    /**
     * Phóng to
     * Author: TMNghia 01/07/2023
     */
    zoomPage() {
      if (this.zoom == true) {
        document.querySelector(".increment-data-table-main").style.height =
          "100000px";
      } else {
        document.querySelector(".increment-data-table-main").style.height = "0";
        this.$refs.assetTableData.style.maxHeight = "calc(100vh - 400px)";
      }
      this.zoom = !this.zoom;
    },
    /**
     * Chọn loại hiển thị
     * Author: TMNghia 01/07/2023
     */
    clickView(i) {
      if (i == 1) {
        this.view = true;
        this.$refs.incrementAssetTable.style.display = "block";
        document.querySelector(".increment-data-table-main").style.maxHeight =
          "calc(100vh - 353px)";
        document.querySelector(".increment-data-table-main").style.height =
          "200px";
      } else {
        this.$refs.incrementAssetTable.style.display = "none";
        document.querySelector(".increment-data-table-main").style.maxHeight =
          "calc(100vh - 310px)";
        document.querySelector(".increment-data-table-main").style.height =
          "1000px";
        this.view = false;
      }
      this.showListView = false;
    },
    /**
     * Hiển thị toast message
     * Author: TMNghia 01/07/2023
     */
    toastMessage(val) {
      this.showToastMessage = true;
      this.toastMessageText = val;
      setTimeout(() => {
        this.showToastMessage = false;
      }, 3000);
    },
  },

  data() {
    return {
      showProgressBar: false,
      showProgressBarDetail: false,
      toastMessageText: "",
      showWarningDelete: false,
      deleteText: "",
      dataTableMainOffsetHeight: 0,
      dataTableMainHeight: "",
      onPull: false,
      currentHeight: 0,
      currentTableHeight: 0,
      currentAssetTableHeight: 0,
      y: 0,
      tradeH: 0,
      zoom: false,
      view: true,
      showListView: false,
      showIncrementForm: false,
      keyword: "",
      onSearch: false,
      formMode: null,
      listAssets: [],
      listIncrements: [],
      listID: [],
      showToastMessage: false,
      reloadIncrements: false,
      warningMessage: "",
      warningShow: false,
      reloadTable: false,
      incrementDelete: null,
      showMWarningDefault: false,
      reloadUpdate: false,
    };
  },

  watch: {
    //Theo dõi chiều cao
    tradeH(val) {
      if (val == 0) {
        this.zoom = true;
      } else {
        this.zoom = false;
      }
    },
    //Theo dõi từ khoá
    keyword(val) {
      if (val == "" && this.isTyping == true) {
        this.onSearch = !this.onSearch;
      }
    },
  },
};
</script>
<style>
@import url("./IncrementPage.css");
</style>
