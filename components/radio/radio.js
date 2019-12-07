// components/radio/radio.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取推荐电台
    getRadio() {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get('/personalized/djprogram').then(res => {
        console.log(res, "推荐电台")
        if (res.data) {
          wx.hideLoading()
          this.setData({
            result: res.data.result
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  ready: function () {
    this.getRadio()
  }
})
