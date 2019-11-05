const { createFilePath } = require('gatsby-source-filesystem')

module.exports = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'blog-list' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}
