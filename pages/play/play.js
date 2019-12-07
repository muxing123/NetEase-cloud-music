// pages/play/play.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    rid: "",
    song: {},
    bgmusic: {},
    src: "",
    value: 0,
    valuePlay: "",
    maxValue: 0,
    maxValuePlay: "",
    play: false,
    num: 0,
    trackIds: [],
    title: '',
    index: 0
  },
  // 去上一页
  goTo() {
    wx.navigateBack({})
  },
  // 获取电台节目详情
  getRadio() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/dj/program/detail?id=${this.data.rid}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          song: res.data.program,
          title: res.data.program.name,
          id: res.data.program.mainSong.id
        })
        this.getRadioUrl()
        wx.setStorageSync("track", res.data.program)
        wx.setStorageSync("id", this.data.song.mainSong.id)
        console.log(res, "电台节目详情")
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取电台节目url
  getRadioUrl() {
    let bgmusic = wx.getBackgroundAudioManager()
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/song/url?id=${this.data.song.mainSong.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        if (this.data.title !== '') {
          bgmusic.title = this.data.title
        }
        bgmusic.src = res.data.data[0].url
        this.setData({
          bgmusic: bgmusic,
          src: res.data.data[0].url
        })
        this.getProgress()
        this.playOrder()
      }
      console.log(res, "电台节目播放")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取歌曲详情
  getSong() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/song/detail?ids=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          song: res.data.songs[0],
          title: res.data.songs[0].name
        })
        wx.setStorageSync("track", res.data.songs[0])
        wx.setStorageSync("id", this.data.id)
      }
      console.log(res, "歌曲详情")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取歌曲url
  getSongUrl() {
    let bgmusic = wx.getBackgroundAudioManager()
    this.getSong()
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/song/url?id=${this.data.id}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        if (this.data.title !== '') {
          bgmusic.title = this.data.title
          console.log(this.data.title)
        }
        bgmusic.src = res.data.data[0].url
        this.setData({
          bgmusic: bgmusic,
          src: res.data.data[0].url
        })
        this.getProgress()
        this.playOrder()
      }
      console.log(res, "歌曲播放")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 转换时间
  transTime(time) {
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
  // 数组随机
  random(arr) {
    let arrRandom = arr.concat()
    for (let i = 0; i < arrRandom.length; i++) {
      let index = Math.floor(Math.random() * arrRandom.length)
      let temp = arrRandom[index]
      arrRandom[index] = arrRandom[i]
      arrRandom[i] = temp
    }
    return arrRandom
  },
  // 获取进度
  getProgress() {
    this.data.bgmusic.onTimeUpdate(() => {
      this.setData({
        value: this.data.bgmusic.currentTime,
        maxValue: this.data.bgmusic.duration,
        valuePlay: this.transTime(this.data.bgmusic.currentTime),
        maxValuePlay: this.transTime(this.data.bgmusic.duration)
      })
    })
  },
  // 改变进度
  sliderchange(e) {
    // this.data.bgmusic.title = this.data.title;不用写也可以
    // this.data.bgmusic.src = this.data.src;
    //获取进度条百分比
    let value = e.detail.value;
    this.setData({
      value
    });
    //调用seek方法跳转歌曲时间
    this.data.bgmusic.seek(value);
    //播放歌曲
    this.data.bgmusic.play();
    if (this.data.play !== false) {
      this.setData({
        play: false
      })
    }
    console.log(e, 111)
  },
  // 播放歌曲
  setPlay() {
    this.setData({
      play: false
    })
    this.data.bgmusic.play()
    wx.setStorageSync("play", this.data.play)
  },
  // 暂停歌曲
  setSuspend() {
    this.setData({
      play: true
    })
    this.data.bgmusic.pause()
    wx.setStorageSync("play", this.data.play)
  },
  // 上一首
  previous() {
    if (this.data.num !== 2) {
      let number = this.data.id * 1
      this.data.trackIds.map((item, index) => {
        if (item.id === number) {
          number = index
        }
      })
      if (number === 0) {
        this.setData({
          id: this.data.trackIds[this.data.trackIds.length - 1].id,
          rid: this.data.trackIds[this.data.trackIds.length - 1].rid,
          play: false
        })
        wx.setStorageSync("play", this.data.play)
      } else {
        this.setData({
          id: this.data.trackIds[number - 1].id,
          rid: this.data.trackIds[number - 1].rid,
          play: false
        })
        wx.setStorageSync("play", this.data.play)
      }
      if (this.data.rid) {
        this.getRadio()
      } else {
        this.getSongUrl()
      }
    } else {
      if (this.data.rid) {
        this.getRadio()
      } else {
        this.getSongUrl()
      }
    }
  },
  // 下一首
  next() {
    if (this.data.num !== 2) {
      let number = this.data.id * 1
      this.data.trackIds.map((item, index) => {
        if (item.id === number) {
          number = index
        }
      })
      if (number === this.data.trackIds.length - 1) {
        this.setData({
          id: this.data.trackIds[0].id,
          rid: this.data.trackIds[0].rid,
          play: false
        })
        wx.setStorageSync("play", this.data.play)
      } else {
        this.setData({
          id: this.data.trackIds[number + 1].id,
          rid: this.data.trackIds[number + 1].rid,
          play: false
        })
        wx.setStorageSync("play", this.data.play)
      }
      if (this.data.rid) {
        this.getRadio()
      } else {
        this.getSongUrl()
      }
    } else {
      if (this.data.rid) {
        this.getRadio()
      } else {
        this.getSongUrl()
      }
    }
  },
  // 设置播放顺序
  setPlayOrder(e) {
    this.setData({
      num: e.currentTarget.dataset.num
    })
    this.playOrder()
  },
  // 播放顺序
  playOrder() {
    // 顺序播放
    if (this.data.num === 0) {
      this.data.bgmusic.onEnded(() => {
        let number = this.data.id * 1
        this.data.trackIds.map((item, index) => {
          if (item.id === number) {
            number = index
          }
        })
        if (number === this.data.trackIds.length - 1) {
          this.setData({
            id: this.data.trackIds[0].id,
            rid: this.data.trackIds[0].rid,
            play: false
          })
          wx.setStorageSync("play", this.data.play)
        } else {
          this.setData({
            id: this.data.trackIds[number + 1].id,
            rid: this.data.trackIds[number + 1].rid,
            paly: false
          })
          wx.setStorageSync("play", this.data.play)
        }
        if (this.data.rid) {
          this.getRadio()
        } else {
          this.getSongUrl()
        }
      })
    } else if (this.data.num === 1) {
      this.setData({
        trackIds: this.random(this.data.trackIds)
      })
      this.data.bgmusic.onEnded(() => {
        let number = this.data.id * 1
        this.data.trackIds.map((item, index) => {
          if (item.id === number) {
            number = index
          }
        })
        if (number === this.data.trackIds.length - 1) {
          this.setData({
            id: this.data.trackIds[0].id,
            rid: this.data.trackIds[0].rid,
            play: false
          })
          wx.setStorageSync("play", this.data.play)
        } else {
          this.setData({
            id: this.data.trackIds[number + 1].id,
            rid: this.data.trackIds[number + 1].rid,
            play: false
          })
          wx.setStorageSync("play", this.data.play)
        }
        if (this.data.rid) {
          this.getRadio()
        } else {
          this.getSongUrl()
        }
      })
    } else {
      this.data.bgmusic.onEnded(() => {
        if (this.data.rid) {
          this.getRadio()
        } else {
          this.getSongUrl()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      trackIds: wx.getStorageSync("trackIds"),
      rid: options.rid
    })
    wx.setStorageSync("play", false)
    if (options.rid) {
      this.getRadio()
    } else {
      this.getSongUrl()
    }
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