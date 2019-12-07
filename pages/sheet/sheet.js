// pages/sheet/sheet.js
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    sheet: "",
    playCount: "",
    subscribedCount: "",
    play: -1,
    playId: 0,
    open: false,
    track: {},
    btOpen: false,
    title: "",
    singer: ""
  },
  // 获取歌单详情
  getSheet() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/playlist/detail?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        let str = Math.round(res.data.playlist.playCount / 10000) + '万'
        let col = res.data.playlist.subscribedCount / 10000
        if (col > 10) {
          this.setData({
            subscribedCount: Math.round(col) + '万'
          })
        } else {
          this.setData({
            subscribedCount: res.data.playlist.subscribedCount
          })
        }
        this.setData({
          sheet: res.data.playlist,
          playCount: str
        })
        let id = wx.getStorageSync("id") * 1
        if (id) {
          this.data.sheet.tracks.map((item, index) => {
            if (item.id === id) {
              this.setData({
                play: index
              })
            }
          })
        }
        wx.setStorageSync("trackIds", res.data.playlist.trackIds)
      }
      console.log(res, "歌单详情")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 去上一页
  goTo() {
    wx.navigateBack({})
  },
  // 去播放歌曲
  goPlay(e) {
    wx.navigateTo({
      url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 控制播放
  setPlay(e) {
    this.setData({
      play: e.currentTarget.dataset.index,
      open: true,
      btOpen: true,
      track: e.currentTarget.dataset.item,
      playId: e.currentTarget.dataset.id
    })
    wx.setStorageSync("track", e.currentTarget.dataset.item)
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/song/url?id=${e.currentTarget.dataset.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        backgroundAudioManager.singer = e.currentTarget.dataset.singer
        backgroundAudioManager.coverImgUrl = e.currentTarget.dataset.pic
        if (e.currentTarget.dataset.name !== '') {
          backgroundAudioManager.title = e.currentTarget.dataset.name
        }
        backgroundAudioManager.src = res.data.data[0].url
      }
      console.log(backgroundAudioManager.title,res, "歌曲播放")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 顺序播放
  playOrder() {
    backgroundAudioManager.onEnded(() => {
      let number = this.data.playId * 1
      this.data.sheet.trackIds.map((item, index) => {
        if (item.id === number) {
          number = index
          this.setData({
            play: index+1
          })
        }
      })
      if (number === this.data.sheet.trackIds.length - 1) {
        this.setData({
          playId: this.data.sheet.trackIds[0].id,
          title: this.data.sheet.tracks[0].name,
          singer: this.data.sheet.tracks[0].ar[0].name,
          track: this.data.sheet.tracks[0]
        })
      } else {
        this.setData({
          playId: this.data.sheet.trackIds[number + 1].id,
          title: this.data.sheet.tracks[number + 1].name,
          singer: this.data.sheet.tracks[number + 1].ar[0].name,
          track: this.data.sheet.tracks[number + 1]
        })
      }
      backgroundAudioManager.singer = this.data.singer
      backgroundAudioManager.title = this.data.title
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get(`/song/url?id=${this.data.playId}`).then(res => {
        if (res.data) {
          wx.hideLoading()
          backgroundAudioManager.src = res.data.data[0].url
        }
        console.log(res, "歌曲播放")
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    })
  },
  // 播放歌曲
  setPlayTwo() {
    backgroundAudioManager.play()
    this.setData({
      open: true
    })
  },
  // 暂停歌曲
  setSuspend() {
    backgroundAudioManager.pause()
    this.setData({
      open: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      copywriter: options.copywriter
    })
    this.getSheet()
    this.playOrder()
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
    let track = wx.getStorageSync("track")
    let play = wx.getStorageSync("play")
    this.getSheet()
    if (track) {
      this.setData({
        track,
        btOpen: true
      })
      if (play === true) {
        this.setData({
          open: false
        })
      } else {
        this.setData({
          open: true
        })
      }
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