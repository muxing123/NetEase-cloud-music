// pages/radio/radio.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    djRadio: {},
    offset: 0,
    asc: false,
    btOpen: false,
    open: true,
    track: {},
    trackIds:[],
    count: 0,
    play: -1,
    programs: []
  },
  // 返回上一页
  goTo() {
    wx.navigateBack({})
  },
  // 转换时间
  transTime(time) {
    time = time / 1000
    let sec = Math.ceil(time % 60)
    if (sec >= 10) {
      sec = sec
    } else {
      sec = "0" + sec
    }
    let min = (time - time % 60) / 60
    if (min >= 10) {
      min = min
    } else {
      min = "0" + min
    }
    time = min + ":" + sec
    return time
  },
  // 获取电台详情
  getRadio() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/dj/detail?rid=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          djRadio: res.data.djRadio
        })
        console.log(res, "电台详情")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取电台节目
  getProgram() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/dj/program?rid=${this.data.id}&offset=${this.data.offset}&asc=${this.data.asc}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        if (this.data.offset === 0) {
          let arr = []
          res.data.programs.map(item => {
            let obj = {}
            obj.rid = item.id
            obj.id = item.mainSong.id
            arr.push(obj)
            let time = new Date()
            let nowyear = time.getFullYear()
            let date = new Date(item.createTime)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (year < nowyear) {
              if (month < 10) {
                month = '0' + month
              }
              if (day < 10) {
                day = '0' + day
              }
              item.createTime = year + "-" + month + "-" + day
            } else {
              if (month < 10) {
                month = '0' + month
              }
              if (day < 10) {
                day = '0' + day
              }
              item.createTime = month + "-" + day
            }
            let num = item.listenerCount / 10000
            if (num > 10) {
              item.listenerCount = Math.round(item.listenerCount / 10000) + '万'
            }
            item.duration = this.transTime(item.duration)
          })
          this.setData({
            trackIds: arr
          })
          wx.setStorageSync("trackIds", arr)
          if (res.data.count > this.data.count) {
            this.setData({
              count: res.data.count
            })
          }
          this.setData({
            programs: res.data.programs
          })
        } else {
          let arr = []
          res.data.programs.map(item => {
            let obj = {}
            obj.id = item.mainSong.id
            obj.rid = item.id
            arr.push(obj)
            let time = new Date()
            let nowyear = time.getFullYear()
            let date = new Date(item.createTime)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (year < nowyear) {
              item.createTime = year + "-" + month + "-" + day
            } else {
              item.createTime = month + "-" + day
            }
            let num = item.listenerCount / 10000
            if (num > 10) {
              item.listenerCount = Math.round(item.listenerCount / 10000) + '万'
            }
            item.duration = this.transTime(item.duration)
          })
          this.setData({
            trackIds: this.data.trackIds.concat(arr)
          })
          wx.setStorageSync("trackIds", this.data.trackIds.concat(arr))
          if (res.data.count > this.data.count) {
            this.setData({
              count: res.data.count
            })
          }
          this.setData({
            programs: this.data.programs.concat(res.data.programs)
          })
        }
        console.log(res, "电台节目")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
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
      url: `/pages/play/play?rid=${e.currentTarget.dataset.id}`,
    })
  },
  // 改变排序
  setAsc() {
    this.data.asc = !this.data.asc
    this.setData({
      asc: this.data.asc,
      offset: 0
    })
    this.getProgram()
  },
  // 上拉加载
  upload() {
    this.data.offset += 30
    this.setData({
      offset: this.data.offset
    })
    this.getProgram()
  },
  // 获取歌曲url
  getSongUrl() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get('/song/url?id=1406238664').then(res => {
      if (res.data) {
        wx.hideLoading()
      }
      console.log(res, "歌曲播放")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getRadio()
    this.getProgram()
    this.getSongUrl()
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
      this.data.programs.map((item, index) => {
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