const BASE_API_URL = "https://localhost:44375/api/";
import ax from "axios";

const axios = ax.create();

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  const token = JSON.parse(localStorage.getItem("token"));
  config.headers = {
    Authorization: `Bearer ${token}`,
  };
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function insertAsset(asset, resolve, reject) {
  axios
    .post(
      `${BASE_API_URL}FixedAssets`, asset
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

function updateAsset(asset, resolve, reject) {
  axios
    .put(
      `${BASE_API_URL}FixedAssets`, asset
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

function checkAssetCode(fixed_asset_code, fixed_asset_id, resolve, reject) {
  axios
    .get(
      `${BASE_API_URL}FixedAssets/CheckCode?code=${fixed_asset_code}&table=fixed_asset&id=${fixed_asset_id}`
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API lấy mã mới tài sản
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 06/04/2023
 */
function getNewCodeAsset(resolve, reject) {
  axios
    .get(`${BASE_API_URL}FixedAssets/NewCodeRecord`)
    .then(resolve)
    .catch((error) => {
      if (reject) {
        reject(error);
      }
    });
}

/**
 * API lấy danh sách tài sản
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getAllAsset(resolve, reject) {
  axios
    .get(`${BASE_API_URL}FixedAssets`)
    .then(resolve)
    .catch((error) => {
      if (reject) {
        reject(error);
      }
    });
}

/**
 * API xoá nhiều tài sản
 * @param {string []} listID danh sách ID tài sản
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function multiDeleteAssets(listID, resolve, reject) {
  axios
    .delete(`${BASE_API_URL}FixedAssets/DeleteRecords`, { data: listID })
    .then(resolve)
    .catch((error) => {
      if (reject) {
        reject(error);
      }
    });
}

/**
 * API lấy thông tin của chứng từ
 * @param {string} fixed_asset_increment_id id chứng từ
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getIncrementInfor(fixed_asset_increment_id, resolve, reject) {
  axios
    .get(
      `${BASE_API_URL}Increments/ListAsset?fixed_asset_increment_id=${fixed_asset_increment_id}`
    )
    .then(resolve)
    .catch((error) => {
      if (reject) {
        reject(error);
      }
    });
}

/**
 * API xoá nhiều chứng từ
 * @param {string []} listID danh sách ID tài sản
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function deleteIncrementsApi(listID, resolve, reject) {
  axios
    .delete(`${BASE_API_URL}Increments/DeleteRecords`, { data: listID })
    .then(resolve)
    .catch((error) => {
      if (reject) {
        reject(error);
      }
    });
}

/**
 * API lấy tên nguồn hình thành
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getBudgetSource(resolve, reject) {
  axios
    .get(`${BASE_API_URL}Increments/BudgetSource`)
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API lấy danh sách chứng từ
 * @param {int} currentPage vị trí trang hiện tại
 * @param {string} keyword từ khoá tìm kiếm
 * @param {int} pageSize kích cỡ trang
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getIncrements(keyword, pageSize, currentPage, resolve, reject) {
  axios
    .get(
      `${BASE_API_URL}Increments/FilterRecords?keyword=${
        keyword == "" ? "none" : keyword
      }&pageSize=${pageSize}&currentPage=${currentPage}`
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API lấy mã mới chứng từ
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getNewCodeIncrement(resolve, reject) {
  axios
    .get(`${BASE_API_URL}Increments/NewCodeRecord`)
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API lấy danh sách tài sản của chứng từ
 * @param {string []} listID danh sách ID chứng từ
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getAssetOfIncrement(listID, resolve, reject) {
  axios
    .post(`${BASE_API_URL}Increments/ListAssets`, listID)
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API phân trang tài sản
 * @param {int} currentPage trang hiện tại
 * @param {string} incrementID id chứng từ
 * @param {string} keyword từ khoá tìm kiếm
 * @param {int} pageSize kích cỡ trang
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function getListAssetFilter(
  keyword,
  pageSize,
  currentPage,
  stringID,
  incrementID,
  resolve,
  reject
) {
  axios
    .post(`${BASE_API_URL}Increments/AssetsFilter`, {
      keyword: keyword == "" ? "none" : keyword,
      pageSize: pageSize,
      currentPage: currentPage,
      stringID: stringID,
      fixed_asset_increment_id: incrementID,
    })
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API thêm mới chứng từ
 * @param {object} incrementRevision thông tin chứng từ
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function insertIncrement(incrementRevision, resolve, reject) {
  axios
    .post(`${BASE_API_URL}Increments/AddIncrement`, incrementRevision)
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}

/**
 * API sửa chứng từ
 * @param {object} incrementRevision thông tin chứng từ
 * @param {int} countBudgets số lượng nguồn hình thành có sẵn
 * @param {int} countDetails số lương chi tiết có sẵn
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function updateInrement(
  incrementRevision,
  countDetails,
  countBudgets,
  resolve,
  reject
) {
  axios
    .put(
      `${BASE_API_URL}Increments/UpdateIncrement?countDetails=${countDetails}&countBudgets=${countBudgets}`,
      incrementRevision
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}
/**
 * API kiểm tra mã trùng
 * @param {object} increment thông tin chứng từ
 * @param {function} resolve hàm xử lý kết quả trả về
 * @param {function} reject hàm xử lý lỗi
 * Author: TMNghia 01/07/2023
 */
function checkIncrementCode(increment, resolve, reject) {
  axios
    .get(
      `${BASE_API_URL}Increments/CheckCode?code=${increment.fixed_asset_increment_code}&table=fixed_asset_increment&id=${increment.fixed_asset_increment_id}`
    )
    .then(resolve)
    .catch((error) => {
      reject(error);
    });
}


export {
  deleteIncrementsApi,
  getBudgetSource,
  getIncrements,
  getNewCodeIncrement,
  getIncrementInfor,
  getAssetOfIncrement,
  getListAssetFilter,
  insertIncrement,
  updateInrement,
  checkIncrementCode,
  getAllAsset,
  multiDeleteAssets,
  getNewCodeAsset,
  checkAssetCode,
  insertAsset,
  updateAsset,
};
