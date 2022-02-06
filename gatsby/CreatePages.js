const path = require('path')
const dayjs = require('dayjs')
const createPaginatedPages = require('gatsby-paginate')

module.exports = ({ actions, graphql }) => {
  const { createPage } = actions
  return graphql(`
        {
            allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: frontmatter___date}
            ) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            tags
                            templateKey
                            slug
                            id
                            title
                            url: slug
                            date
                            tags
                            description
                            headerImage
                        }
                    }
                }
            }
        }
    `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { edges = [] } = result.data.allMarkdownRemark

    const tagSet = new Set()

    createPaginatedPages({
      edges,
      createPage,
      context: {
        articleNum: edges.length,
      },
      pageLength: 5,
      pageTemplate: 'src/templates/blog-list.js',
      pathPrefix: 'blog-list',
    })

    edges.forEach(({ node }, index) => {
      const { id, frontmatter, fields } = node
      const {
        tags, templateKey, date: publishDate,
      } = frontmatter
      if (tags) {
        tags.forEach(item => tagSet.add(item))
      }

      const datePrefix = dayjs(publishDate).format('YYYY/MM/DD')

      const component = templateKey || 'blog-post'
      const postPath = `/${datePrefix}${fields.slug}`
      createPage({
        path: postPath,
        component: path.resolve(`src/templates/${String(component)}.js`),
        context: {
          id,
          index,
        },
      })
    })
  })
}
