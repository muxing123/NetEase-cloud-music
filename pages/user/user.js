// pages/user/user.js
import area from '../../lib/area.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: {},
    level: 0,
    listenSongs: 0,
    playlist: [],
    nickname: "",
    register: "",
    year: 0,
    birthday: "",
    createList: [],
    like: {},
    events: []
  },
  // 去歌单页面
  goSheet(e) {
    wx.navigateTo({
      url: `/pages/sheet/sheet?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 获取用户详情
  getUser() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/detail?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let time = new Date(res.data.createTime)
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let register = year + '年' + month + '月'
        let now = new Date()
        this.data.year = Math.round((now - res.data.createTime) / 1000 / 60 / 60 / 24 / 365)
        let date = new Date(res.data.profile.birthday)
        let birthday = date.getFullYear() + ''
        birthday = birthday.charAt(2) + '0'
        let province = area.province_list[res.data.profile.province]
        let city = area.city_list[res.data.profile.city]
        this.setData({
          profile: res.data.profile,
          nickname: res.data.profile.nickname,
          level: res.data.level,
          listenSongs: res.data.listenSongs,
          register,
          year: this.data.year,
          birthday,
          province,
          city
        })
        console.log(res, "用户详情")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取用户歌单
  getUserSheet() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/playlist?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let num = 0
        res.data.playlist.map((item, index) => {
          if (index !== 0) {
            let num = item.playCount / 10000
            if (num > 10) {
              item.playCount = Math.round(item.playCount / 10000) + '万'
            }
            if (item.creator.nickname === this.data.nickname) {
              this.data.createList.push(item)
            }
          }
        })
        res.data.playlist.splice(1, this.data.createList.length)
        this.data.like = res.data.playlist.splice(0, 1)[0]
        this.setData({
          playlist: res.data.playlist,
          like: this.data.like,
          createList: this.data.createList
        })
        console.log(res, "用户歌单")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取用户动态
  getEvent() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/user/event?uid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          events: res.data.events
        })
        console.log(res, "用户动态")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 返回上一页
  goTo() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getUser()
    this.getUserSheet()
    this.getEvent()
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