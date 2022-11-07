// components/MyDialog/MyDialog.js
Component({
  
  properties: {
    visible: {
      type:Boolean,
      value: false
    }
  },
  
  data: {
    // showDialog: false,
    // maskShowClass: false,
    // maskShow: false,
    // dialogAnimation: false,
    // dialogShowClass: false,
    // dialogShow: false
  },
  
  methods: {
    nofunction() {
      return
    },

    closeDialog() {
      this.setData({
        visible: false
      })
      this.triggerEvent('close')
    },
    options: {
      multipleSlots: true // 复数插槽: 是
    }

  }
})
