// pages/album/album.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    album: {},
    songs: [],
    play: -1,
    track: {},
    btOpen: false,
    open: true,
  },

  // 获取专辑内容
  getAlbum() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/album?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let date = new Date(res.data.album.publishTime)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        res.data.album.publishTime = year + "." + month + "." + day
        this.setData({
          album: res.data.album,
          songs: res.data.songs
        })
        let arr = []
        res.data.songs.map(item => {
          let obj = {}
          obj.id = item.id
          arr.push(obj)
        })
        wx.setStorageSync("trackIds", arr)
      }
      console.log(res, "专辑内容")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 去上一页
  goTo() {
    wx.navigateBack({})
  },
  // 去歌曲播放页面
  goPlay(e) {
    this.setData({
      play: e.currentTarget.dataset.index,
      btOpen: true,
      track: e.currentTarget.dataset.item
    })
    wx.setStorageSync("track", e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 顺序播放
  setOrder(e) {
    wx.navigateTo({
      url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getAlbum()
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
    let id = wx.getStorageSync("id") * 1
    let play = wx.getStorageSync("play")
    let track = wx.getStorageSync("track")
    if (id) {
      this.data.songs.map((item, index) => {
        if (item.id === id) {
          this.setData({
            play: index
          })
        }
      })
    }
    if (track) {
      this.setData({
        track
      })
    }
    if (play === true) {
      this.setData({
        open: false
      })
    } else {
      this.setData({
        open: true
      })
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