// components/dish/dish.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setNum(e) {
      this.setData({
        num: e.currentTarget.dataset.num
      })
      if(this.data.num === 0) {
        this.getDish()
      }else {
        this.getSong()
      }
    },
    // 获取新碟
    getDish() {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get('/album/newest').then(res => {
        console.log(res, "新碟")
        if (res.data) {
          wx.hideLoading()
          this.setData({
            result: res.data.albums.splice(0,6)
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    },
    // 获取新歌
    getSong() {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get('/top/song?type=7').then(res => {
        console.log(res, "新歌")
        if (res.data) {
          wx.hideLoading()
          this.setData({
            result: res.data.data.splice(0, 6)
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    },
    // 去专辑页面
    goAlbum(e) {
      wx.navigateTo({
        url: `/pages/album/album?id=${e.currentTarget.dataset.id}`,
      })
    },
    // 去歌曲播放页面
    goPlay(e) {
      wx.navigateTo({
        url: `/pages/play/play?id=${e.currentTarget.dataset.id}`
      })
    },
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  ready: function () {
    this.getDish()
  }
})
