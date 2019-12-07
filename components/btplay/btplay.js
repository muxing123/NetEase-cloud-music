// components/btplay/btplay.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    track: {
      type: Object,
      value: {}
    },
    open: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 暂停歌曲
    setSuspend() {
      this.setData({
        open: false
      })
      backgroundAudioManager.pause()
    },
    // 播放歌曲
    setPlayTwo() {
      this.setData({
        open: true
      })
      backgroundAudioManager.play()
    },
    // 去歌曲播放页面
    goPlay(e) {
      wx.navigateTo({
        url: `/pages/play/play?id=${e.currentTarget.dataset.id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  ready: function () {
    let track = wx.getStorageSync("track")
    if (track) {
      this.setData({
        track
      })
    }
  }
})
