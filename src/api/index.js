import dayjs from 'dayjs'

// Prevent webpack window problem
const isBrowser = () => typeof window !== 'undefined'

const getPath = () => (isBrowser() ? window.location.href : '')
const getUrl = (publishDate, url) => `/${dayjs(publishDate).format('YYYY/MM/DD')}/${url}`

export {
  isBrowser,
  getPath,
  getUrl,
}

export * from './text'
