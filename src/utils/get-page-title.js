import defaultSettings from '@/settings'

const title = defaultSettings.title || '小巨人后台管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title}`
  }
  return `${title}`
}
