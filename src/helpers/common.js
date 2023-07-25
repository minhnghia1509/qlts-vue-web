

const commonJS = {
  /**
   * Định dạng tiền
   * Author: Trần Minh Nghĩa (20/3/2023)
   */
  formatMoney: function (money) {
    try {
      if (money == 0) {
        return 0;
      }
      let defaultValue;
      let isInput = false;
      if (typeof money == "string") {
        money = this.unFormatMoney(money);
        defaultValue = money;
        isInput = true;
      }
      let decimal = ("0." + (money + "").split(".")[1]) * 1;
      let integer = parseInt(money).toString().split("");
      let rs = "";
      if (integer.length > 3) {
        for (let i = integer.length; i > 0; i--) {
          if ((integer.length - i + 1) % 3 == 1 && i < integer.length) {
            rs = integer[i - 1] + "." + rs;
          } else {
            rs = integer[i - 1] + rs;
          }
        }
      } else {
        rs = integer.join("");
      }
      if (decimal >= 0 && isInput == false) {
        rs = rs + "," + (decimal.toFixed(4) + "").substring(2);
      } else if (decimal > 0 && isInput == true) {
        rs = rs + "," + (decimal + "").substring(2);
      }
      if (isInput && (defaultValue + "").includes(",")) {
        rs = rs + ",";
      }
      if (money == "") {
        rs = "";
      }
      return rs;
    } catch (error) {
      return 0;
    }
  },

  formatMoneyN: function (money) {
    try {
      let rs = '';
      money = money.toFixed().toString().split('');
      if (money.length > 3) {
        for (let i = money.length; i > 0; i--) {
          if ((money.length - i + 1) % 3 == 1 && i < money.length) {
            rs = money[i - 1] + "." + rs;
          } else {
            rs = money[i - 1] + rs;
          }
        }
      }
      if (rs == '') {
        rs = 0;
      }
      return rs;
    } catch (e) {
      return 0;
    }
  },
  /**
   * Hàm huỷ format tiền
   */
  unFormatMoney: function (money) {
    try {
      money = money.split(".").join("");
      if (money.includes(",")) {
        money = money.split(",");
        let decimal = money[1];
        let integer = money[0];
        if (decimal) {
          return (
            integer * 1 +
            (decimal * 1) / Math.pow(10, (decimal + "").length)
          ).toFixed(decimal.length);
        } else if (integer) {
          return integer + ",";
        }
      } else {
        return money;
      }
    } catch (error) {
      return 0;
    }
  },
  // Format ngày tháng
  // Author: TMNghia(20/3/2023)
  formatDate: function (date) {
    try {
      date = new Date(date);
      let dateValue = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this.twoCharacters(dateValue) + '/' + this.twoCharacters(month) + '/' +year;
    } catch (error) {
      return "";
    }
  },

  twoCharacters(val) {
    return val.toString().length === 1 ? '0' + val.toString() : val;
  },
  // Huỷ format ngày tháng
  // Author: TMNghia(20/3/2023)
  unFormatDate: function (date) {
    try {
      let dateArray = date.split("/");
      return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    } catch (error) {
      return "";
    }
  },

  getNewID(array) {
    array.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    let lastItem = array[array.length - 1] + 1 + "";

    let l = lastItem.split("").length;
    for (let i = 0; i < 5 - l; i++) {
      lastItem = "0" + lastItem;
    }
    return "TS" + lastItem;
  },

  fNumber(value) {
    if (value) {
      let last = value.split("")[value.length - 1];
      let val = value.substring(0, value.length - 1);
      if (val.includes(',') && last == ',') {
        return val;
      } else if (val.includes(',') && last != ',') {
        if (
          last == "0" ||
          last == "1" ||
          last == "2" ||
          last == "3" ||
          last == "4" ||
          last == "5" ||
          last == "6" ||
          last == "7" ||
          last == "8" ||
          last == "8" ||
          last == "9") {
          return value;
        } else {
          return val;
        }
      }
      else if (!val.includes(',')) {
        if (
          last == "0" ||
          last == "1" ||
          last == "2" ||
          last == "3" ||
          last == "4" ||
          last == "5" ||
          last == "6" ||
          last == "7" ||
          last == "8" ||
          last == "8" ||
          last == "9" ||
          last == ","
        ) {
          return value;
        } else {
          return val;
        }
      } 
    }else {
      return '';
    }
  },

  isCodeFormat(value) {
    if (value.substring(0, 2) == 'TS' && value.length == 7) {
      if (isNaN(value.substring(2, 7) * 1)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },

  filterArray(array) {
    var index = -1,
      arr_length = array ? array.length : 0,
      resIndex = -1,
      result = [];

    while (++index < arr_length) {
      var value = array[index];

      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  },

  minusArrayIncrements(array1, array2) { 
    return array1.filter((item) => {
      if (!this.incrementIncludes(array2, item)) {
        return item;
      }
    })
  },

  assetsIncludes(list, item) {
    for (let i = 0; i < list.length; i++){
      if (list[i].fixed_asset_id == item.fixed_asset_id) {
        return true;
      }
    }
    return false;
  },

  minusArrayAssets(array1, array2) { 
    return array1.filter((item) => {
      if (!this.assetsIncludes(array2, item)) {
        return item;
      }
    })
  },

  incrementIncludes(list, item) {
    for (let i = 0; i < list.length; i++){
      if (list[i].fixed_asset_increment_id == item.fixed_asset_increment_id) {
        return true;
      }
    }
    return false;
  },

  handleError(error) {
    let message = ''
    if (error.response.status == 404 || error.response.status == 400) {
      message = error.response.data;
    } else if (error.response.status == 415) {
      message = this.errorMessage415;
    } else if (error.response.status == 500) {
      message = error.response.data.userMsg;
    }
    return message;
  },
};

export default commonJS;
