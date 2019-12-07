// pages/playvideo/playvideo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    related: [],
    detail: {},
    url: "",
    show: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '视频',
    })
    this.setData({
      id: options.id
    })
    this.getDetail()
    this.getRelated()
    this.getUrl()
  },
  // 获取视频详情
  getDetail() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/video/detail?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          detail: res.data.data
        })
      }
      console.log(res, "视频详情")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取相关视频
  getRelated() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/related/allvideo?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          related: res.data.data
        })
      }
      console.log(res, "相关视频")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取视频播放地址
  getUrl() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/video/url?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          url: res.data.urls[0].url
        })
      }
      console.log(res, "视频播放地址")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 控制视频封面展示
  setShow() {
    this.setData({
      show: false
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