// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },
  // 获取手机号
  onPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取密码
  onPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 手机登录
  getPhone() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/login/cellphone?phone=${this.data.phone}&password=${this.data.password}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let data = res.data
        wx.setStorageSync("user", data)
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }
      console.log(res, "用户信息")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 邮箱登录
  getEmail() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/login?email=${this.data.phone}@163.com&password=${this.data.password}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let data = res.data
        wx.setStorageSync("user", data)
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }
      console.log(res, "用户信息")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})