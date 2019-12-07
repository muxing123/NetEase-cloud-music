// pages/data/data.js
import area from '../../lib/area.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    show: false,
    showCity: false,
    showGender: false,
    nickname: "",
    gender: "",
    birthday: "",
    birthdayUpload: 0,
    currentDate: new Date().getTime(),
    minDate: new Date(1970, 10, 1).getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    signature: "",
    town: "",
    areaList: area,
    city: "",
    province: ""
  },
  // 修改昵称
  setNickname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  // 修改性别
  setGender(e) {
    this.setData({
      num: e.currentTarget.dataset.num,
      gender: e.currentTarget.dataset.num === 0 ? '保密' : (e.currentTarget.dataset.num === 1 ? '男' : '女'),
      genderUpload: e.currentTarget.dataset.num,
      showGender: false
    })
  },
  // 修改签名
  setSignature(e) {
    signature: e.detail.value
  },
  // 修改生日
  setBirthday(value) {
    let n = value.detail;
    let date = new Date(n);
    let y = date.getFullYear() + '-';
    let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let dateTime = y + m + d
    this.setData({
      birthday: dateTime,
      birthdayUpload: value.detail,
      show: false
    });
  },
  // 修改城市
  setTwon(obj) {
    console.log(obj)
    let str = ""
    obj.detail.values.map(item => {
      str = str + item.name
    })
    this.setData({
      town: str,
      showCity: false,
      province: obj.detail.values[0].code,
      city: obj.detail.values[1].code
    })
  },
  // 控制性别弹出层打开
  setPopGender() {
    this.setData({
      showGender: true
    })
  },
  // 控制生日弹出层打开
  setPop() {
    this.setData({
      show: true
    })
  },
  // 控制城市弹出层打开
  setPopCity() {
    this.setData({
      showCity: true
    })
  },
  // 控制弹出层关闭
  onClose() {
    this.setData({
      show: false,
      showCity: false,
      showGender: false
    })
  },
  // 修改用户信息
  modify() {
    wx.showToast({
      title: '修改成功',
    })
    app.globalData.fly.get(`/user/update?gender=${this.data.genderUpload}&signature=${this.data.signature}&city=${this.data.city}&nickname=${this.data.nickname}&birthday=${this.data.birthdayUpload}&province=${this.data.province}`).then(res => {
      console.log(res, "修改用户信息")
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的资料',
    })
    let user = wx.getStorageSync("user")
    let num = user.profile.gender
    let str = area.province_list[user.profile.province] + area.city_list[user.profile.city]
    let n = user.profile.birthday;
    if (n > 0) {
      let date = new Date(n);
      let y = date.getFullYear() + '-';
      let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let dateTime = y + m + d
      this.setData({
        birthday: dateTime
      })
    } else {
      this.setData({
        birthday: ''
      })
    }
    this.setData({
      nickname: user.profile.nickname,
      gender: num === 0 ? '保密' : (num === 1 ? '男' : '女'),
      genderUpload: num,
      birthdayUpload: user.profile.birthday,
      province: user.profile.province,
      city: user.profile.city,
      town: str,
      signature: user.profile.signature
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})