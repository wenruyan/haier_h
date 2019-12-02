import store from '../store';
const mixin = {
  data() {
    return {

    }
  },
  computed: {
    test1: () => 123
  },
  methods: {
    /**
     * 格式化时间
     * @param {string|number|object|Array} dateTime - 时间，可以是一个字符串、时间戳、表示时间的对象、Date对象或者******表示时间的数组
     * @param {string} [fmt] - 格式
     * @returns {string} 返回格式化后的日期时间，默认格式：2018年1月11日 15:00
     * @see [momentjs]{@tutorial http://momentjs.cn/}
     */
    formatDate(dateTime, fmt = 'YYYY年M月DD日 HH:mm:ss') {
      if (!dateTime) {
        return ''
      }
      return dateTime
    },
    PUSH(data) {
      // if (data.query) {
      //   if (!data.query.companyNo && this.$route.query.companyNo) {
      //     data.query.companyNo = this.$route.query.companyNo
      //   }
      // } else if (this.$route.query.companyNo) {
      //   data.query = {
      //     companyNo: this.$route.query.companyNo
      //   }
      // }
      this.$router.push(data)
    },
    REPLACE(data) {
      // if (data.query) {
      //   if (!data.query.companyNo && this.$route.query.companyNo) {
      //     data.query.companyNo = this.$route.query.companyNo
      //   }
      // } else if (this.$route.query.companyNo) {
      //   data.query = {
      //     companyNo: this.$route.query.companyNo
      //   }
      // }
      console.log(data, 'replace');
      this.$router.replace(data);
    },
    GO(data) {
      this.$router.isBack = true
      this.$router.go(data)
    },
    loginOut() {
      store.commit('resetInfo', '')
      this.REPLACE({
        path: "/login-account"
      });
    },
    typeStringToArry(string) {
      // 将两头有[]的字符串转为数组
      if (string && typeof string == 'string' && string.substr(0, 1) == '[' && string.substr(string.length - 1, 1) == ']') {
        if (string.substr(1, string.length - 2) != '') {
          string = string.substr(1, string.length - 2).split(',').map((item) => {
            if ((item.substr(0, 1) == "'" && item.substr(item.length - 1, 1) == "'") || (item.substr(0, 1) == '"' && item.substr(item.length - 1, 1) == '"')) {
              return item.substr(1, item.length - 2)
            }
            return item
          })
        } else {
          string = []
        }
        return string
      } else if (typeof string == 'object' && string != null) {
        return string
      }
      return []
    },
    decodeURL(url) {
      return decodeURIComponent(url)
    },
    encodeURL(url) {
      return encodeURIComponent(url)
    },
    getUrlFileName(fileUrl) {
      let str = fileUrl;
      str = str.substring(str.lastIndexOf("/") + 1);
      str = str.substring(0, str.lastIndexOf("."));
      return str;
    },
    changeNumUnit(num) {
      // 将数字转换为万单位
      if (num > 9999) {
        num = Math.round(num / 10000) + '万';
      }
      return num
    },
    // 手机号校验
    regMobile(mobile) {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      return reg.test(mobile)
    },
    // 整数校验
    regNumber(number) {
      let reg = /^[0-9]*$/;
      return reg.test(number)
    },
    regHttp(str) {
      return str.substr(0, 4) == 'http'
    },
    /**
     * 将一串字符中的一部分加密成*号
     * @param {*} num 待加密字符
     * @param {*} startL  前面显示的明文长度
     * @param {*} endL  后面显示的明文长度
     */
    hideNumber(num, startL, endL) {
      num = num.toString()
      if (startL + endL > num.length) {
        return num
      } else if (startL + endL == num.length) {
        let s = ''
        for (let i = 0; i < num.length; i++) {
          s += '*'
        }
        return s
      } else {
        let s = ''
        let sS = num.substr(0, startL)
        let eS = num.substr(-endL, endL)
        for (let i = 0; i < num.length - startL - endL; i++) {
          s += '*'
        }
        return sS + s + eS
      }
    },
    hidePhone(num) { // 用hideNumber方法处理手机号
      return this.hideNumber(num, 3, 4)
    },
    // 三位分节法
    formatNum(str) {
      let newStr = "";
      let count = 0;
      for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = str.charAt(i) + "," + newStr;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count++;
      }
      return newStr
    },
    replaceData(data) { // 斜杠转成-
      return data.replace(/\//g, '-')
    },
    // 跳转到权益
    goRight(item) {
      console.log(item, 'item');
      // 权益可跳转
      if (item.status == 20) {
        // this.$dialog.loading.open('');
        // 权益类型 qytype
        // 30-直充模式
        // 40-含兑换码模式
        // 50-代下单模式
        // 11：文章
        this.record('', item.id, () => {
          let path;
          if (item.qytype == '11') {
            if (item.isselect == '10') {
              location.href = item.externallinks;
              return false;
            } else {
              path = '/equityMiddle';
            }
          } else {
            if (item.qytype == '30' || item.qytype == '50') {
              path = '/goods-detail';
            } else if (item.qytype == '40') {
              path = '/activationCodeRecive';
            }
          }
          this.PUSH({
            path,
            'query': {
              goodsId: item.id,
              qytype: item.qytype
            }
          });
        });
      } else {
        this.$dialog.toast({
          mes: "敬请期待",
          timeout: 1500
        });
      }
    },
    // 判断是否在微信中
    is_weixin() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 记录日志
    record(obj, rightId, cb) {
      // 权益通用
      if (rightId) {
        obj = {
          pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页
          operationType: "10", // 用户操作行为-10:按钮,20:输入
          operationObject: "70", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
          contentNo: rightId, // 内容ID:只有在点击快报和权益的时候才有
          contentType: "20", // 内容类型10-文章20-虚拟商品SKU
          sort: "", // 海尔翻牌的九宫格序号  1-9
          paraType: "" // 统计类型	10-UV 20-PV
        }
      }
      obj['productNo'] = '20'; // 产品编号-20:乐业卡
      obj['pageNo'] = '30'; // 用户操作页面-10:登录页,20:注册页,30:产品页
      obj['mid'] = '2510005310976000';
      if (store.state.userId) {
        obj['userId'] = store.state.userId; // 用户id
      }
      obj['hideloading'] = true
      obj['hideError'] = true

      this.$http
        .post(
          '/log/focus.sysLogApi', obj
        ).then(res => {
          // this.$dialog.loading.close();
          // cb && cb();
        })
      setTimeout(() => {
        cb && cb();
      }, 50)
    },
    // 取sku图片
    getSkuImg(arr, pictype) {
      let url = [];
      arr.forEach(e => {
        if (e.pictype == pictype) {
          url.push(e.url);
        }
      });
      return url;
    },
    // 权益取sku图片
    getRightSkuImg(ele, status) {
      status = status || ele.status;
      if (status == '10') {
        ele.productdescription = '敬请期待';
      }
      status = status == '10' ? '50' : '40';
      ele.imgUrl = this.getSkuImg(ele.skuimage, status)[0];
    },
    // 去除所有空格
    trimAll(str) {
      str = str.replace(/\s+/g, "");
      return str
    },
    // 联系我们
    goContact() {
      window.location.href =
        "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MzYyNzMxMQ%3d%3d&scene=110#wechat_redirect";
    },
    // 复制
    copyTxt(text, noToast) {
      // 数字没有 .length 不能执行selectText 需要转化成字符串
      const textString = text.toString();
      let input = document.querySelector("#copyObj");
      input.value = textString;
      // ios必须先选中文字且不支持 input.select();
      selectText(input, 0, textString.length);
      console.log(document.execCommand("copy"), "execCommand");
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        // alert("已复制到粘贴板");
      }
      input.blur();

      // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
      // 选择文本。createTextRange(setSelectionRange)是input方法
      function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {
          // ie
          const range = textbox.createTextRange();
          range.collapse(true);
          range.moveStart("character", startIndex); // 起始光标
          range.moveEnd("character", stopIndex - startIndex); // 结束光标
          range.select(); // 不兼容苹果
        } else {
          // firefox/chrome
          textbox.setSelectionRange(startIndex, stopIndex);
          textbox.focus();
        }
      }
      if (noToast) return false
      this.$dialog.toast({
        mes: "复制成功",
        timeout: 1500,
        callback() { }
      });

      // 复制文字
      // 必须手动触发 点击事件或者其他事件，不能直接使用js调用！！！
      // this.copyTxt("h5实现一键复制到粘贴板 兼容ios");
    }
  }
}
export default mixin
