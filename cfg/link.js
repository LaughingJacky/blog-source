const about = '/2019/02/01/about-shawb-wong/'

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
    href: '/blog-list',
    text: 'BlogList',
  },
  {
    href: '/draft',
    text: 'Draft',
  },
  {
    href: about,
    text: 'About',
  },
]

const redirectors = [
  // {
  //   fromPath: '/',
  //   toPath: '/blogList',
  // },
]

module.exports = {
  menuList,
  redirectors,
}
