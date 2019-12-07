// components/search/search.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    offset: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 1,
    cat: 1,
    show: 1,
    value: "",
    albums: [],
    artists: [],
    mvs: [],
    songs: [],
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

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开搜索页面
    open() {
      this.setData({
        show: 2
      })
      this.triggerEvent('onSearch', this.data.show)
    },
    // 关闭搜索页面
    close() {
      this.setData({
        show: 1
      })
      this.triggerEvent('close', this.data.show)
    },
    // 搜索
    onSearch(e) {
      console.log(typeof(e.detail))
      if (typeof(e.detail) !== "object") {
        this.setData({
          value: e.detail,
          show: 3
        })
        this.getSearch()
        this.triggerEvent('onSearch', this.data.show)
      } else {
        this.setData({
          show: 2
        })
        this.triggerEvent('onSearch', this.data.show)
      }
    },
    // 实时改变value值
    change(e) {
      this.setData({
        value: e.detail
      })
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
              res.data.result.songs.map(item => {
                item.name = this.getHilightStrArray(item.name, this.data.value)
                item.album.name = this.getHilightStrArray(item.album.name, this.data.value)
                item.artists[0].name = this.getHilightStrArray(item.artists[0].name, this.data.value)
              })
              this.setData({
                songs: res.data.result.songs
              })
            }else {
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
    }
  },
  observers: {
    'value' (val) {
      if (val.trim() !== "") {
        this.getSuggest();
      }
    }
  }
})