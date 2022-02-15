export const imgerror = {
  inserted(dom, options) {
    dom.src = dom.src || dom.options.value // 有值赋值，没有值给默认值,如果src为空，它不会触发onerror事件

    dom.onerror = function() { // src给img找不到图片会触发onerror事件
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || dom.options.value
  }
}
