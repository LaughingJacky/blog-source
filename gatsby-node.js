const Promise = require("bluebird")
const path = require("path")

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const pages = []
    const blogPost = path.resolve("./src/templates/blog-post.js")
    resolve(
      graphql(
        `
      {
        allContentfulBlogPost {
          edges {
            node {
              title
              slug
            }
          }
        }
      }
    `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allContentfulBlogPost.edges
        posts.forEach(({node}) => {
          createPage({
            path: `/blog/${node.slug}/`,
            component: blogPost,
            context: {
              slug: node.slug
            },
          })
        })
      })
    )
  })
}
