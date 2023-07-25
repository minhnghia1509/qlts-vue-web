const assetsAPI = 'https://localhost:44375/api/FixedAssets/'

var assetIDError = {
    status: "",
    value: "Mã tài sản không được để trống"
  }
var assetNameError = {
    status: "",
    value: "Tên tài sản không được để trống"
  }
var departmentIDError = {
    status: "",
    value: "Mã bộ phận không được để trống"
  }
var categoryIDError = {
    status: "",
    value: "Mã loại tài sản không được để trống"
  }
var quantityError = {
    status: "",
    value: "Số lượng không được để trống"
  }
var ratioError = {
    status: "",
    value: "Tỉ lệ hao mòn không được để trống"
}
var priceError = {
    status: "",
    value: "Nguyên giá không được để trống"
  }
var buyDateError = {
    status: "",
    value: "Ngày mua không được để trống"
  }
var useDateError = {
    status: "",
    value: "Ngày sử dụng không được để trống"
}

var duplicateCode = "Mã đã trùng!";
  
var ErrorElements = [assetIDError, assetNameError, departmentIDError, categoryIDError, quantityError, priceError, ratioError, buyDateError, useDateError];

var ErrorIncrement = [
  {
    status: null,
    value: "Mã chứng từ không được để trống!"
  },
  {
    status: null,
    value: "Ngày bắt đầu sử dụng không được để trống!"
  },
  {
    status: null,
    value: "Ngày ghi tăng không được để trống!"
  }
]

var Message = {
  duplicateCode: "Mã đã trùng!",
  loginSuccess: "Đăng nhập thành công!",
  insertSuccess: "Thêm mới thành công!",
  deleteSuccess: "Xoá thành công!",
  updateSuccess: "Sửa thành công!",
  deleteRequest: "Bạn cần chọn chứng từ để xoá?",
  requestAtleastOne: "Bạn cần chọn ít nhất một tài sản!",
  deleteOneIncrement: "Bạn có muốn xoá chứng từ có mã",
  deleteIncrements: " chứng từ đã được chọn, bạn có muốn xoá các chứng từ này khỏi dánh sách?"
}
export { ErrorElements, duplicateCode, ErrorIncrement, Message};

export default assetsAPI;