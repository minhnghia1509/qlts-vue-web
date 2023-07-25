<template>
  <div class="side-bar" v-if="miniBar" @click="miniBar=false; openBar = true">
    <div class="side-bar-home">
      <div class="home-icon"></div>
    </div>
    <div  class="side-bar-icon top">
      <i class="icon icon-1"> </i>
    </div>
    <div class="side-bar-icon side-bar-item-focus">
      <i class="icon icon-2"> </i>
    </div>
    <div class="side-bar-icon ">
      <i class="icon icon-3"> </i>
    </div>
    <div class="side-bar-icon">
      <i class="icon icon-4"> </i>
    </div>
    <div class="side-bar-icon">
      <i class="icon icon-5"> </i>
    </div>
    <div class="side-bar-icon">
      <i class="icon icon-6"> </i>
    </div>
    <div class="side-bar-icon">
      <i class="icon icon-7"> </i>
    </div>
  </div>

  <div class="side-bar side-bar-open" v-if="openBar">
    <div class="side-bar-open-body">
      <div class="side-bar-home">
        <div class="home-icon"></div>
        <p>MISA QLTS</p>
      </div>
      <div  class="side-bar-icon top side-bar-single" @click="clickInfor" :class="{'side-bar-item-focus': page == 1}">
        <i class="icon icon-1"> </i>
        <p>Tổng quan</p>
      </div>
      <div class="side-bar-icon side-bar-icon-group" :class="{'side-bar-item-focus': page == 2}" @click="clickAssetDropdown">
        <div class="side-bar-icon-prev">
          <i class="icon icon-2"> </i>
          <p class="side-bar-item">Tài sản</p>
        </div>
        <i class="icon icon-arrow-down side-bar-open-icon"></i>
      </div>
      <ul class="asset-dropdown-list" v-if="showAssetDropdown" @click="event=>{event.stopPropagation()}">
        <li class="asset-dropdown-item" :class="{'asset-dropdown-item-focused': focusAssetIncrement}" @click="clickIncrement" ref="assetIncrement"><p :class="{'asset-dropdown-item-p-focused': focusAssetIncrement}">Ghi tăng</p></li>
        <li class="asset-dropdown-item"><p>Thay đổi thông tin</p></li>
        <li class="asset-dropdown-item"><p>Đánh giá lại</p></li>
        <li class="asset-dropdown-item"><p>Tính hao mòn</p></li>
        <li class="asset-dropdown-item"><p>Điều chuyển tài sản</p></li>
        <li class="asset-dropdown-item"><p>Ghi giảm</p></li>
        <li class="asset-dropdown-item"><p>Kiểm kê</p></li>
        <li class="asset-dropdown-item"><p>Khác</p></li>
      </ul>
      <div class="side-bar-icon side-bar-icon-group">
        <div class="side-bar-icon-prev">
          <i class="icon icon-3"> </i>
          <p class="side-bar-item">Tài sản HT-ĐB</p>
        </div>
        <i class="icon icon-arrow-down side-bar-open-icon"></i>
      </div>
      <div class="side-bar-icon side-bar-icon-group">
        <div class="side-bar-icon-prev">
          <i class="icon icon-4"> </i>
          <p class="side-bar-item">Công cụ dụng cụ</p>
        </div>
        <i class="icon icon-arrow-down side-bar-open-icon"></i>
      </div>
      <div class="side-bar-icon side-bar-single">
        <i class="icon icon-5"> </i>
        <p class="side-bar-item">Danh mục</p>
      </div>
      <div class="side-bar-icon side-bar-icon-group">
        <div class="side-bar-icon-prev">
          <i class="icon icon-6"> </i>
          <p class="side-bar-item">Tra cứu</p>
        </div>
        <i class="icon icon-arrow-down side-bar-open-icon"></i>
      </div>
      <div class="side-bar-icon side-bar-icon-group">
        <div class="side-bar-icon-prev">
          <i class="icon icon-7"> </i>
          <p class="side-bar-item">Báo cáo</p>
        </div>
        <i class="icon icon-arrow-down side-bar-open-icon"></i>
      </div>
    </div>

    <div class="side-bar-open-footer">
      <div class="side-bar-open-footer-icon" @click="miniBar=true; openBar = false">
        <div class="icon-arrow-left" ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  methods: {
    clickAssetDropdown() {
      this.showAssetDropdown = !this.showAssetDropdown;
      this.page = 2;
    },
    clickIncrement() {
      this.focusAssetIncrement = true;
      this.focusAssetInfor = false;
      this.$emit('changePage', 1);
    },
    clickInfor() {
      this.focusAssetInfor = true;
      this.focusAssetIncrement = false;
      this.showAssetDropdown = false;
      this.$emit('changePage', 2);
      this.page = 1;
    },
  },
  data() {
    return {
      miniBar: true,
      openBar: false,
      showAssetDropdown: false,
      focusAssetIncrement: false,
      focusAssetInfor: false,
      page: 1,
    }
  }


};
</script>
<style>
@import url("./SideBar.css");
</style>
