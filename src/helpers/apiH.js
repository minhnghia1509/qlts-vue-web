import { BASE_API_URL } from "@/config";
import ax from "axios";
import emitter from "@/common/emitter";
import router from '../router'
import _enum from "@/data/enum";

const axios = ax.create()

// tạo header request trước khi gửi api
axios.interceptors.request.use(function(config) {
    // thêm token vào request
    const token = localStorage.getItem('bearer_token')
    config.headers = {
        Authorization: `Bearer ${token}`
    }
    return config
})

// xử lý trong trường hợp xảy ra lỗi
axios.interceptors.response.use(function(response) {
    return response
}, function(error) {
    const response = error?.response?.data
    if(!response)
        return
        
    if(response.errorCode == _enum.errorCode.InvalidToken) {
        router.push('/login')
    }
    
    // tạo message
    const message = response.userMessage + "."
    // bắn ra thông báo
    emitter.emit('setDialogMessage', message)
    return Promise.reject(error)
})


// lấy dữ liệu danh sách tài sản đã được filter
function getFilterFixedAssetApi(pageSize, currentPage, departmentId, fixedAssetCategoryId, textSearch, resolve, bonusReject) {
    axios.get( `${BASE_API_URL}fixedAsset/filter?pageSize=${pageSize}&currentPage=${currentPage}&departmentId=${departmentId}&fixedAssetCategoryId=${fixedAssetCategoryId}&textSearch=${textSearch}`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })   
}

// lấy tất cả phòng ban
async function getDepartmentsApi(bonusReject) {
    try {
        const response =  await axios.get(`${BASE_API_URL}department`)
        return response.data
    } catch(error) {
        if(bonusReject) {
            bonusReject(error)
        }
    } 
}

// lấy tất cả loại tài sản
async function getFixedAssetCategorysApi(bonusReject) {
    try {
        const response = await axios.get(`${BASE_API_URL}fixedAssetCategory`)
        return response.data
    } catch(error) {
        if(bonusReject){
            bonusReject(error)
        }
    }
   
}

// lấy gợi ý mã tài sản
function getRecommendFixedAssetCodeApi(resolve, bonusReject) {
    axios.get(`${BASE_API_URL}fixedAsset/recommendFixedAssetCode`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// sửa tài sản
function editFixedAssetApi(fixedAssetId, body, resolve, bonusReject) {
    axios.put(`${BASE_API_URL}fixedAsset/${fixedAssetId}`, body)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// lấy 1 tài sản
function getFixedAssetApi(fixedAssetId, resolve, bonusReject) {
    axios.get(`${BASE_API_URL}fixedAsset/${fixedAssetId}`)
    .then(({data}) => {
        resolve(data)
    })
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// thêm tài sản
function postFixedAssetApi(body, resolve, bonusReject) {
    axios.post(`${BASE_API_URL}fixedAsset`, body)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// kiểm tra mã tài sản bị trùng
async function getFixedAssetCodeExistedApi(fixedAssetCode, fixedAssetId, bonusReject) {
    try {
        let response = await axios.get(`${BASE_API_URL}fixedAsset/isCodeExisted?code=${fixedAssetCode}&id=${fixedAssetId}`)
        return response.data
    } catch(error) {
        if(bonusReject){
            bonusReject(error)
        }
    }
}

async function getLicenseCodeExistedApi(licenseCode, licenseId, reject) {
    try {
        let response = await axios.get(`${BASE_API_URL}license/isCodeExisted?code=${licenseCode}&id=${licenseId}`)
        return response.data
    } catch(error) {
        if(reject){
            reject(error)
        }
    }
}

// xóa tài sản
function deleteFixedAssetsApi(listFixedAsset, resolve, bonusReject) {
    axios.delete(`${BASE_API_URL}fixedAsset`, { data: listFixedAsset})
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// import dữ liệu từ file vào db
function postImportFileApi(typeImport, formData, isSubmit, resolve, bonusReject) {
    axios.post(`${BASE_API_URL}${typeImport}/file?isSubmit=${isSubmit}`, formData, {headers: { "Content-Type": "multipart/form-data"}})
    .then(({data}) => resolve(data))
    .catch(error => {
        if(bonusReject){
            bonusReject(error)
        }
    })
}

// kiểm tra người dùng đã sở hữu token hợp lệ ở trang đăng nhập
async function getIsLoginedApi() {
    const token = localStorage.getItem("bearer_token");
    await ax.get(`${BASE_API_URL}auth`, { headers: { Authorization: `Bearer ${token}` } });
}

// lấy token từ username và passoword do người dùng nhập
function getTokenApi(email, passoword, resolve, reject) {
    ax.post(`${BASE_API_URL}auth`, {
        email: email,
        password: passoword
    })
    .then(({data}) => resolve(data))
    .catch(error => reject(error))
} 

function getFilterLicensesApi(pageSize, currentPage, textSearch, resolve, reject) {
    axios.get(`${BASE_API_URL}license/filter?pageSize=${pageSize}&currentPage=${currentPage}&textSearch=${textSearch}`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject)
            reject(error)
    })
}

function getRecommendLicenseCodeApi(resolve, reject) {
    axios.get(`${BASE_API_URL}license/recommendLicenseCode`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject)
            reject(error)
    })
}

function getFilterFixedAssetNoLicenseApi(pageSize, currentPage, listIdSelected, textSearch, resolve, reject) {
    axios.post(`${BASE_API_URL}fixedAsset/filterNoLicense`, {
        pageSize, currentPage, listIdSelected, textSearch        
    })
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject)
            reject(error)
    })
}

function GetAllBudgetApi(resolve, reject) {
    axios.get(`${BASE_API_URL}budget`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject) {
            reject(error)
        }
    })
}

function GetBudgetsByFixedAssetIdApi(fixedAssetId, resolve, reject) {
    axios.get(`${BASE_API_URL}budget/listModel?fixedAssetId=${fixedAssetId}`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(error)
            reject(error)
    })
    
}

function getLicenseByIdApi(licenseId, resolve, reject) {
    axios.get(`${BASE_API_URL}license/${licenseId}`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject) {
            reject(error)
        }
    })
}

function getListFixedAssetByLicenseId(licenseId, resolve, reject) {
    axios.get(`${BASE_API_URL}fixedAsset/listByLicenseId?licenseId=${licenseId}`)
    .then(({data}) => resolve(data))
    .catch(error => {
        if(reject) {
            reject(error)
        }
    })
}

export {getFilterFixedAssetApi, GetAllBudgetApi,getListFixedAssetByLicenseId, getLicenseCodeExistedApi, getLicenseByIdApi, getDepartmentsApi, GetBudgetsByFixedAssetIdApi, getFixedAssetCategorysApi, getRecommendFixedAssetCodeApi, editFixedAssetApi, getFixedAssetApi, postFixedAssetApi, getFixedAssetCodeExistedApi, deleteFixedAssetsApi, postImportFileApi, getIsLoginedApi, getTokenApi, getFilterLicensesApi, getRecommendLicenseCodeApi, getFilterFixedAssetNoLicenseApi}