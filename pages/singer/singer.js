// pages/singer/singer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerType: [{
        type: "入驻歌手",
        cat: 5001
      },
      {
        type: "华语男歌手",
        cat: 1001
      },
      {
        type: "华语女歌手",
        cat: 1002
      },
      {
        type: "华语组合/乐队",
        cat: 1003
      },
      {
        type: "欧美男歌手",
        cat: 2001
      },
      {
        type: "欧美女歌手",
        cat: 2002
      },
      {
        type: "欧美组合/乐队",
        cat: 2003
      },
      {
        type: "日本男歌手",
        cat: 6001
      },
      {
        type: "日本女歌手",
        cat: 6002
      },
      {
        type: "日本组合/乐队",
        cat: 6003
      },
      {
        type: "韩国男歌手",
        cat: 7001
      },
      {
        type: "韩国女歌手",
        cat: 7002
      },
      {
        type: "韩国组合/乐队",
        cat: 7003
      },
      {
        type: "其他男歌手",
        cat: 4001
      },
      {
        type: "其他女歌手",
        cat: 4002
      },
      {
        type: "其他组合/乐队",
        cat: 4003
      },
    ],
    letterList: [
      "热", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
      "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
    num: 0,
    cat: 5001,
    artists: [],
    initial: "",
    offset: 0,
    active: 0
  },
  // 去歌手详情页面
  goTo(e) {
    wx.navigateTo({
      url: `/pages/singerdetail/singerdetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 歌手分类索引
  setCat(event) {
    this.setData({
      cat: event.detail.name,
      offset: 0
    })
    this.getSingerCat()
  },
  // 字符索引
  setNum(e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      offset: 0
    })
    if (e.currentTarget.dataset.item === '热') {
      this.setData({
        initial: ''
      })
    } else {
      this.setData({
        initial: e.currentTarget.dataset.item
      })
    }
    this.getSingerCat()
  },
  // 获取歌手分类列表
  getSingerCat() {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.cat === 5001) {
      app.globalData.fly.get(`/artist/list?cat=5001&offset=${this.data.offset}&limit=30`).then(res => {
        console.log(res, "歌手分类列表")
        if (res.data) {
          wx.hideLoading()
          if(this.data.offset > 0) {
            let arr = this.data.artists.concat(res.data.artists)
            this.setData({
              artists: arr
            })
          }else {
            this.setData({
              artists: res.data.artists
            })
          }
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    } else {
      app.globalData.fly.get(`/artist/list?cat=${this.data.cat}&initial=${this.data.initial}&offset=${this.data.offset}&limit=30`).then(res => {
        console.log(res, "歌手分类列表")
        if (res.data) {
          wx.hideLoading()
          if (this.data.offset > 0) {
            let arr = this.data.artists.concat(res.data.artists)
            this.setData({
              artists: arr
            })
          } else {
            this.setData({
              artists: res.data.artists
            })
          }
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    }
  },
  // 上拉加载
  upload() {
    // let num = this.data.offset + 30
    // this.setData({
    //   offset: num
    // })
    this.data.offset += 30
    this.setData({
      offset: this.data.offset
    })
    this.getSingerCat()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '歌手',
    })
    this.getSingerCat()
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
    // let pages = this.data.pages + 1
    // let num = (pages - 1)*30
    // this.setData({
    //   offset: num,
    //   pages
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})