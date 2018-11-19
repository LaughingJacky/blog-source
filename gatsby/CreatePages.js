const path = require('path')
const dayjs = require('dayjs')
const { redirectors = [], blogPostCfg } = require('../cfg')


module.exports = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators

  redirectors.forEach(({ fromPath, toPath = '/' }) => {
    createRedirect({ fromPath, redirectInBrowser: true, toPath })
    // Uncomment next line to see forEach in action during build
    console.log(`Redirecting: ${fromPath} To: ${toPath}`)
  })

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allContetfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
          edges {
            node {
              title
              publishDate
            }
          }
        }
      }
    `).then((result) => {
      if (result.error) {
        console.error(result.error)
        return reject()
      }
      const posts = result.data.allContetfulBlogPost.edges
      const pages = Math.ceil(posts.length / blogPostCfg.maxPages)

      for (let index = 0; index < pages; index += 1) {
        createPage({
          path: `blogList/${index + 1}`,
          component: path.resolve('./src/templates/blog-list.js'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            limit: blogPostCfg.maxPages,
            skip: index * blogPostCfg.maxPages,
          },
        })
      }

      posts.map(({ node }, index) => {
        const { publishDate, title } = node
        const date = dayjs(publishDate).format('YYYY/MM/DD')
        // const postPath = slug === 'about' ? slug : `${date}/${title}`
        return createPage({
          path: `${date}/${title}`,
          component: path.resolve('./src/templates/blog-post.js'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            index,
          },
        })
      })
      return resolve()
    })
  })
}
