// exports.sourceNodes = require('./gatsby/sourceNodes')

exports.onCreateNode = require('./gatsby/onCreateNode')

exports.createPages = require('./gatsby/CreatePages')

exports.onCreateWebpackConfig = require('./gatsby/onCreateWebpackConfig')

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
      type SitePage implements Node @dontInfer {
        path: String!
      }
    `)
}
