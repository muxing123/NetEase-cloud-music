//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btOpen: false,
    track: {},
    value: "",
    banners: [],
    result: [],
    show: 1,
    hotList: [],
    offset: 0,
    cat: 1,
    active: 1,
    albums: [],
    artists: [],
    mvs: [],
    songs: [],
    songIds: [],
    videos: [],
    history: [],
    searchType: [{
        type: "综合",
        cat: 1018
      },
      {
        type: "单曲 ",
        cat: 1
      },
      {
        type: "视频",
        cat: 1014
      },
      {
        type: "歌手",
        cat: 100
      },
      {
        type: "专辑",
        cat: 10
      },
      {
        type: "歌单",
        cat: 1000
      },
      {
        type: "电台",
        cat: 1009
      },
      {
        type: "用户",
        cat: 1002
      }
    ],
  },
  // 获取轮播图
  getWheel() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get('/banner?type=2').then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          banners: res.data.banners
        })
      }
      console.log(res, "轮播图")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取推荐歌单
  getRcommend() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get('/personalized?limit=6').then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          result: res.data.result
        })
      }
      console.log(res, "推荐歌单")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取搜索热榜
  getHotList() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get('/search/hot/detail').then(res => {
      if (res.data) {
        wx.hideLoading()
        this.setData({
          hotList: res.data.data
        })
      }
      console.log(res, "搜索热榜")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 打开搜索页面
  open() {
    this.setData({
      show: 2
    })
  },
  // 改变当前标签页
  setTab(e) {
    this.setData({
      active: e.detail
    })
    console.log(this.data.active)
  },
  // 搜索
  onSearch(e) {
    if (typeof(e.detail) !== "object") {
      this.setData({
        value: e.detail,
        show: 3
      })
      this.getSearch()
    } else if (e.currentTarget.dataset.word) {
      this.setData({
        value: e.currentTarget.dataset.word,
        show: 3
      })
      this.getSearch()
    } else {
      this.setData({
        show: 2
      })
    }
  },
  // 拼接搜索
  onAlbums(e) {
    let str = e.currentTarget.dataset.artist + e.currentTarget.dataset.name
    this.setData({
      value: str,
      show: 3
    })
    this.getSearch()
  },
  // 关闭搜索页面
  close() {
    this.setData({
      show: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '网易云音乐',
    })
    this.getWheel()
    this.getRcommend()
    this.getHotList()
  },
  // 实时改变value值
  change(e) {
    this.setData({
      value: e.detail
    })
    if (e.detail) {
      this.getSuggest()
    }
  },
  // 获取搜索建议
  getSuggest() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/search/suggest?keywords=${this.data.value}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        if (res.data.result.albums) {
          this.setData({
            albums: res.data.result.albums
          })
        }
        if (res.data.result.artists) {
          this.setData({
            artists: res.data.result.artists
          })
        }
        if (res.data.result.mvs) {
          this.setData({
            mvs: res.data.result.mvs
          })
        }
      }
      console.log(res, "搜索建议")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 搜索分类索引
  setCat(event) {
    this.setData({
      cat: event.detail.name,
      offset: 0
    })
    this.getSearch()
  },
  // 获取搜索结果
  getSearch() {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/search?keywords=${this.data.value}&type=${this.data.cat}&offset=${this.data.offset}`).then(res => {
      if (res.data) {
        wx.hideLoading()
        if (this.data.cat === 1) {
          if (this.data.offset === 0) {
            let arr = []
            res.data.result.songs.map(item => {
              let obj = {}
              obj.id = item.id
              arr.push(obj)
            })
            res.data.result.songs.map(item => {
              item.name = this.getHilightStrArray(item.name, this.data.value)
              item.album.name = this.getHilightStrArray(item.album.name, this.data.value)
              item.artists[0].name = this.getHilightStrArray(item.artists[0].name, this.data.value)
            })
            this.setData({
              songs: res.data.result.songs,
              songIds: arr
            })
            wx.setStorageSync("trackIds", this.data.songIds)
          } else {
            let arr = []
            res.data.result.songs.map(item => {
              let obj = {}
              obj.id = item.id
              arr.push(obj)
            })
            wx.setStorageSync("trackIds", this.data.songIds.concat(arr))
            res.data.result.songs.map(item => {
              item.name = this.getHilightStrArray(item.name, this.data.value)
              item.album.name = this.getHilightStrArray(item.album.name, this.data.value)
              item.artists[0].name = this.getHilightStrArray(item.artists[0].name, this.data.value)
            })
            this.setData({
              songs: this.data.songs.concat(res.data.result.songs)
            })
          }
        }
        // if (this.data.cat === 1014) {
        //   if (this.data.offset === 0) {
        //     res.data.result.videos.map(item => {
        //       item.title = this.getHilightStrArray(item.title, this.data.value)
        //       item.creator[0].userName = this.getHilightStrArray(item.creator[0].userName, this.data.value)
        //       let col = item.playTime / 10000
        //       if (col > 10) {
        //         item.playTime = Math.floor(col) + '万'
        //       }
        //       item.durationms = this.transTime(item.durationms)
        //     })
        //     this.setData({
        //       videos: res.data.result.videos
        //     })
        //   } else {
        //     res.data.result.videos.map(item => {
        //       item.title = this.getHilightStrArray(item.title, this.data.value)
        //       item.creator[0].userName = this.getHilightStrArray(item.creator[0].userName, this.data.value)
        //       let col = item.playTime / 10000
        //       if (col > 10) {
        //         item.playTime = Math.ceil(col) + '万'
        //       }
        //       item.durationms = this.transTime(item.durationms)
        //     })
        //     this.setData({
        //       videos: this.data.videos.concat(res.data.result.videos)
        //     })
        //   }
        // }
      }
      console.log(res, "搜索结果")
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 搜索关键字高亮显示
  //返回一个使用key切割str后的数组，key仍在数组中
  getHilightStrArray(str, key) {
    return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
  },
  // 去歌曲播放页面
  goPlay(e) {
    this.setData({
      btOpen: true,
      track: e.currentTarget.dataset.item
    })
    wx.setStorageSync("track", e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
    })
    if (this.data.history.indexOf(this.data.value) < 0) {
      this.data.history.unshift(this.data.value)
      wx.setStorageSync("history", this.data.history)
    }
  },
  // 删除历史记录
  del() {
    let that = this
    wx.showModal({
      content: '确定清空全部历史记录？',
      success(res) {
        if (res.confirm) {
          that.setData({
            history: []
          })
          wx.setStorageSync("history", that.data.history)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 顺序播放
  setOrder(e) {
    wx.navigateTo({
      url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 转换时间
  transTime(time) {
    let date = time / 1000
    let sec = Math.ceil(date % 60)
    if (sec >= 10) {
      sec = sec
    } else {
      sec = "0" + sec
    }
    let min = (date - date % 60) / 60
    if (min >= 10) {
      min = min
    } else {
      min = "0" + min
    }
    time = min + ":" + sec
    return time
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
    let history = wx.getStorageSync("history")
    if (history) {
      this.setData({
        history
      })
    }
    let play = wx.getStorageSync("play")
    if (play === true) {
      this.setData({
        open: false
      })
    } else {
      this.setData({
        open: true
      })
    }
    let track = wx.getStorageSync("track")
    if (track) {
      this.setData({
        track
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
    this.data.offset += 30
    this.setData({
      offset: this.data.offset
    })
    this.getSearch()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})