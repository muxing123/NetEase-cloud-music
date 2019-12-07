// components/video/video.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    offset: 0,
    videos: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去视频播放页面
    govideo(e) {
      wx.navigateTo({
        url: `/pages/playvideo/playvideo?id=${e.currentTarget.dataset.id}`,
      })
    },
    // 搜索结果
    getSearch() {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get(`/search?keywords=${this.data.value}&type=1014&offset=${this.data.offset}`).then(res => {
        if (res.data) {
          wx.hideLoading()
          if (this.data.offset === 0) {
            res.data.result.videos.map(item => {
              item.title = this.getHilightStrArray(item.title, this.data.value)
              item.creator[0].userName = this.getHilightStrArray(item.creator[0].userName, this.data.value)
              let col = item.playTime / 10000
              if (col > 10) {
                item.playTime = Math.floor(col) + '万'
              }
              item.durationms = this.transTime(item.durationms)
            })
            this.setData({
              videos: res.data.result.videos
            })
          } else {
            res.data.result.videos.map(item => {
              item.title = this.getHilightStrArray(item.title, this.data.value)
              item.creator[0].userName = this.getHilightStrArray(item.creator[0].userName, this.data.value)
              let col = item.playTime / 10000
              if (col > 10) {
                item.playTime = Math.ceil(col) + '万'
              }
              item.durationms = this.transTime(item.durationms)
            })
            this.setData({
              videos: this.data.videos.concat(res.data.result.videos)
            })
          }
        }
        console.log(res, "搜索结果")
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
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
    // 搜索关键字高亮显示
    //返回一个使用key切割str后的数组，key仍在数组中
    getHilightStrArray(str, key) {
      return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
    },
    // 上拉加载
    upload() {
      this.data.offset += 30
      this.setData({
        offset: this.data.offset
      })
      this.getSearch()
    }
  },
  ready: function() {
    this.getSearch()
  }
})