import dayjs from 'dayjs'

// Prevent webpack window problem
const isBrowser = () => typeof window !== 'undefined'
const getPath = () => (isBrowser() ? window.location.href : '')
const getUrl = (publishDate, slug) => `/${dayjs(publishDate).format('YYYY/MM/DD')}${slug}`

export {
  isBrowser,
  getPath,
  getUrl,
}

export * from './text'
