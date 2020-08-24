import { Message, MessageBox } from 'element-ui'
import store from '@/vuex'

// 消息提示
export const msg = {
  pop(str, options) {
    const {
      offset = window._msgLocationY, // 弹窗位置
      onClose = () => {}, // 关闭回调
      duration = 2000, // 关闭时间
      type // 方式
    } = options
    Message({
      message: str,
      type: type,
      duration: duration,
      onClose: onClose,
      offset: offset,
      dangerouslyUseHTMLString: true
    })
  },
  error(str, options) {
    this.pop(str, { ...options, type: 'error' })
  },
  success(str, options) {
    this.pop(str, { ...options, type: 'success' })
  }
}

// 确认弹窗
export const msgBox = (str, options = {}) => {
  const {
    className = '', // 自定义class名
    yes = function() {}, // 确定事件
    cancel = function() {}, // 取消事件
    buttons = ['确定'], // 按钮数组名
    title = '信息' // 标题
  } = options
  MessageBox.confirm(str, title, {
    customClass: 'common-msg-box ' + className,
    dangerouslyUseHTMLString: true,
    showCancelButton: buttons.length > 1,
    showConfirmButton: buttons.length > 0,
    cancelButtonText: buttons[1] || '取消',
    confirmButtonText: buttons[0] || '确认',
    closeOnClickModal: false,
    cancelButtonClass: 'common-msg-cancel-btn',
    confirmButtonClass: 'common-msg-yes-btn'
  })
    .then(() => {
      yes()
    })
    .catch(() => {
      cancel()
    })
}

/**
* 页面回到某处
*/
export const scrollTop = (el, from = 0, to, duration = 800, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step

    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 *  得到缓存数据
 *
 * @param {*} name
 * @param {*} [data={}]
 * @returns
 */
export const getCacheData = (name, data = {}) => {
  return new Promise(resolve => {
    const getData = store.getters['cache_' + name]
    const flag = getData('flag')

    if (flag) {
      resolve(getData('data'))
    } else {
      store.dispatch('cache_' + name, data).then(res => {
        resolve(res)
      })
    }
  })
}

/**
 *一维数组转多维数组
 *
 * @param {*} dataArr
 * @returns
*/
export const toTree = dataArr => {
  const data = JSON.parse(JSON.stringify(dataArr))
  const mapData = {}
  const val = []

  data.map(item => {
    mapData[item.id] = item
  })
  data.map(item => {
    var pData = mapData[item.pId]

    if (pData) {
      (pData.children || (pData.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}

/**
 * 新手引导设置
 *
 * @param {*} [arr=[]]
 * @param {boolean} [flag=false]
 * @returns
 */
export const setUserGuide = (arr = [], flag = false) => {
  const done = store.getters.guide_done

  if (done) {
    store.commit('guide_add', arr)
    if (!flag) return
    store.commit('guide_show')
  } else {
    store.dispatch('guide_init').then(() => {
      store.commit('guide_add', arr)
      if (!flag) return
      store.commit('guide_show')
    })
  }
}

/**
 * 教学中心-改变激活链接状态
 *
 * @param {string} [str='']
 */
export const changeTeachingActive = (str = '') => {
  store.commit('common_active', str)
}

/**
 * 全屏预览图片
 *
 * @param {string} [url='']
 */
export const previewImg = (url = '') => {
  store.commit('common_previewImg', { show: true, url: url })
}

/**
 * 清除缓存数据
 *
 * @param {*} key
 * @returns
 */
export const clearSingleCache = keyStr => {
  if (!keyStr) return false
  const arr = keyStr.split(',')
  arr.forEach(item => {
    store.commit('cache_clearSingle', item)
  })
}

/**
 * 设置诸葛信息
 *
 * @param {*} str
 * @param {*} data
 * @returns
 */
export const setZhuge = (str, data) => {
  // eslint-disable-next-line no-undef
  if (!zhuge) return false
  const addData = {
    ...data,
    platform: 'PCT'
  }
  // eslint-disable-next-line no-undef
  zhuge.track('教师端-' + str, addData)
}

/**
 * 回到顶部
 *
 * @param {number} [num=0]
 */
// eslint-disable-next-line no-undef
export const backTop = (num = 0) => $(document).scrollTop(num)

/**
 * 判断是否已经登录
 *
 * @param {boolean} [autoAlertLogin=true] 是否弹出登录框
 * @param {*} { regist = false, third = true } 注册，是否展示第三方登录
 * @returns
 */
export const isLogin = (autoAlertLogin = true, { regist = false, third = true } = {}) => {
  const loginFlag = store.getters.user_isLogin
  if (!loginFlag && autoAlertLogin) {
    store.commit('common_loginDialog', { show: true, regist, third })
  }
  return loginFlag
}

/**
 * 对象转成url参数字符串
 *
 * @param {*} data
 * @returns
 */
export const getDataStr = data => {
  let params = ''
  Object.keys(data).forEach((key, index) => {
    // eslint-disable-next-line eqeqeq
    if (index == 0) {
      params += `${key}=${data[key]}`
    } else {
      params += `&${key}=${data[key]}`
    }
  })
  return params
}

/**
 *获取文件图标
 *
 * @param {*} type
 * @returns
 */

export const getFileIcon = type => {
  const fileIcoData = {
    // 压缩包
    zip: 'icon-yasuobao',
    jar: 'icon-yasuobao',
    rar: 'icon-yasuobao',
    iso: 'icon-yasuobao',
    // 图片
    jpeg: 'icon-tupian',
    gif: 'icon-tupian',
    jpg: 'icon-tupian',
    png: 'icon-tupian',
    bmp: 'icon-tupian',
    // 视频
    avi: 'icon-shipin_huaban',
    mov: 'icon-shipin_huaban',
    rmvb: 'icon-shipin_huaban',
    flv: 'icon-shipin_huaban',
    mp4: 'icon-shipin_huaban',
    // 文档
    doc: 'icon-wendang',
    txt: 'icon-wendang',
    pdf: 'icon-wendang',
    ppt: 'icon-wendang',
    // 音频
    mp3: 'icon-mp',
    wma: 'icon-mp'
  }

  const str = type.toLowerCase()
  // eslint-disable-next-line eqeqeq
  if (str == 'path') {
    return 'icon-file'
  }

  return fileIcoData[str] || 'icon-weizhiwenjian'
}

/**
 *下载文件
 * @param {*} res 文件流
 * @param {*} filename 文件名
 */
export const downloadFile = (res, filename) => {
  const blob = new Blob([res])
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = filename
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}
