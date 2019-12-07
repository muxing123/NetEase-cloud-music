// components/recommend/recommend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Array,
      value: () => []
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
    // 去歌单页面
    goTo(e) {
      wx.navigateTo({
        url: `/pages/sheet/sheet?id=${e.currentTarget.dataset.id}&copywriter=${e.currentTarget.dataset.copywriter}`,
      })
    }
  }
})
