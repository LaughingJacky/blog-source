const asyncForEach = require('../src/api/asyncForEach')
const getPosts = require('./getPosts')
const { getContent } = require('../src/api/text')

// Create node for createNode function
const processDatum = (datum, html = '', toc = [], headImg = 'https://i.imgur.com/M795H8A.jpg') => ({
  id: datum.sys.id,
  parent: 'Contentful',
  children: [],
  internal: {
    type: 'contetfulBlogPost',
    contentDigest: datum.sys.id,
  },
  html,
  toc,
  headImg,
  ...datum.fields,
})

const makeNode = async ({ contentType, createNode }) => {
  const { data } = await getPosts(contentType)
  // Process data into nodes.
  // Async forEach function is used in here,
  // please refer to the blog

  asyncForEach(data.items, async (datum) => {
    if (datum && datum.fields && datum.fields.body) {
      const { html, toc } = await getContent(datum.fields.body)
      const associateAssets = data.includes.Asset.filter(
        a => a.sys.id === datum.fields.heroImage.sys.id,
      )
      const headImg = associateAssets.length && associateAssets[0].fields.file.url
      createNode(processDatum(datum, html, toc, headImg))
    } else {
      console.error('cannot find body')
    }
  })
}

// const createHeader = async (createNode) => {
//   const { data } = await getPosts('headers')
//   data.items.forEach((datum) => {
//     const node = {
//       id: datum.sys.id,
//       parent: 'Headers',
//       children: [],
//       internal: {
//         type: 'Header',
//         contentDigest: datum.fields.headerImage || 'no-header-image',
//       },
//       ...datum.fields,
//     }
//     createNode(node)
//   })
// }

module.exports = async ({ actions }) => {
  const { createNode } = actions
  // Create nodes here, generally by downloading data
  // from a remote API.

  await makeNode({ contentType: 'blogPost', createNode })

  // Make changable headers
  // await createHeader(createNode)
}
