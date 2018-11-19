const about = '/blog/about-shawb-wong'

const menuList = [
  {
    href: '/',
    text: 'Home',
  },
  {
    href: '/tags',
    text: 'Tags',
  },
  {
    href: '/blogList/1',
    text: 'BlogList',
  },
  {
    href: about,
    text: 'About',
  },
]

const redirectors = [
  {
    fromPath: '/',
    toPath: '/page/1/',
  },
]

module.exports = {
  menuList,
  redirectors,
}
