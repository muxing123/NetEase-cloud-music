// components/albumlist/albumlist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ""
    },
    history: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    offset: 0,
    albums: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去专辑页面
    goAlbum(e) {
      wx.navigateTo({
        url: `/pages/album/album?id=${e.currentTarget.dataset.id}`,
      })
      if (this.data.history.indexOf(this.data.value) < 0) {
        this.data.history.unshift(this.data.value)
        wx.setStorageSync("history", this.data.history)
      }
    },
    // 搜索结果
    getSearch() {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.fly.get(`/search?keywords=${this.data.value}&type=10&offset=${this.data.offset}`).then(res => {
        if (res.data) {
          wx.hideLoading()
          if (this.data.offset === 0) {
            res.data.result.albums.map(item => {
              item.name = this.getHilightStrArray(item.name, this.data.value)
              item.artist.name = this.getHilightStrArray(item.artist.name, this.data.value)
              let date = new Date(item.publishTime)
              let year = date.getFullYear()
              let month = date.getMonth() + 1
              let day = date.getDate()
              item.publishTime = year + "." + month + "." + day
            })
            this.setData({
              albums: res.data.result.albums
            })
          } else {
            res.data.result.albums.map(item => {
              item.name = this.getHilightStrArray(item.name, this.data.value)
              item.artist.name = this.getHilightStrArray(item.artist.name, this.data.value)
              let date = new Date(item.publishTime)
              let year = date.getFullYear()
              let month = date.getMonth() + 1
              let day = date.getDate()
              item.publishTime = year + "." + month + "." + day
            })
            this.setData({
              albums: this.data.albums.concat(res.data.result.albums)
            })
          }
        }
        console.log(res, "搜索结果专辑")
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