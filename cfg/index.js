const header = require('./header')
const link = require('./link')
const blogPost = require('./blog-post')

module.exports = {
  ...header,
  ...link,
  ...blogPost,
}
