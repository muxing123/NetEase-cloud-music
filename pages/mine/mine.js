// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    userInfo: {},
    follow: 0,
    fans: 0,
    sign: false
  },
  // 去登录页面
  goTo() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // 获取用户详情
  getUserInfo() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/detail?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          userInfo: res.data
        })
      }
      console.log(res, "用户信息")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取用户关注
  getFollow() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/follows?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          follow: res.data.follow.length
        })
      }
      console.log(res, "用户关注")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取用户粉丝
  getFans() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/followeds?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          fans: res.data.followeds.length
        })
      }
      console.log(res, "用户粉丝")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取用户动态
  getAction() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/event?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          action: res.data.events.length
        })
      }
      console.log(res, "用户动态")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 签到
  getSign() {
    wx.showToast({
      title: '签到成功',
    })
    this.setData({
      sign: true
    })
    app.globalData.fly.get('/daily_signin').then(res => {
      if (res.data) {
        wx.hideLoading()
      }
      console.log(res, "签到")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 退出登录
  quit() {
    this.setData({
      id: ""
    })
    app.globalData.fly.get('/logout').then(res => {
      try {
        wx.removeStorageSync('user')
      } catch (e) {}
      console.log(res, "退出登录")
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.setNavigationBarTitle({
    //   title: '我的',
    // })
    // let user = wx.getStorageSync("user")
    // if(user) {
    //   this.setData({
    //     id: user.account.id
    //   })
    //   this.getUserInfo()
    //   this.getFollow()
    //   this.getFans()
    //   this.getAction()
    // }
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
    wx.setNavigationBarTitle({
      title: '我的',
    })
    let user = wx.getStorageSync("user")
    if (user) {
      this.setData({
        id: user.account.id
      })
      this.getUserInfo()
      this.getFollow()
      this.getFans()
      this.getAction()
    }
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