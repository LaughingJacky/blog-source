const Promise = require("bluebird")
const path = require("path")

const { createFilePath } = require('gatsby-source-filesystem');
const axios = require('axios');
const { getContent } = require('./src/api/text.js');

const API_BASE_URL = 'https://cdn.contentful.com';
const API_SPACE_ID = '49fdbwmpdowy';
const API_TOKEN = '63caeb300ae46255595611c480207a0e43d1fd688af238a1020b8ec0985ff826';

// Get All Post from Contentful
const getPosts = async (contentType) => {
  const order = '-fields.publishDate';
  const POST_URL = `${API_BASE_URL}/spaces/${API_SPACE_ID}/entries`;
  const res = await axios.get(POST_URL, {
    params: {
      order,
      content_type: contentType,
      access_token: API_TOKEN,
    },
  }).catch((err) => {
    console.log(err);
  });
  return res;
};

// Create node for createNode function
const processDatum = (datum, html = '', toc = [], headImg = 'https://i.imgur.com/M795H8A.jpg') => ({
  id: datum.sys.id,
  parent: 'Contentful',
  children: [],
  internal: {
    type: 'contentfulBlogPost',
    contentDigest: datum.sys.id,
  },
  html,
  toc,
  headImg,
  ...datum.fields,
});

const asyncForEach = async (array = [], callback = () => {}) => {
  for (let i = 0, n = array.length; i < n; i += 1) {
    await callback(array[i], i, array);
  }
};

const makeBlogNode = async ({ contentType, createNode }) => {
  const { data } = await getPosts(contentType);

  // Process data into nodes.
  // Async forEach function is used in here,
  // please refer to the blog

  asyncForEach(data.items, async (datum) => {
    const { html, toc } = await getContent(datum.fields.body);
    const associateAssets = data.includes.Asset.filter(a => {
      return a.sys.id === datum.fields.heroImage.sys.id
    })
    const headImg = associateAssets.length && associateAssets[0].fields.file.url
    createNode(processDatum(datum, html, toc, headImg));
  });
};

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators;
  // Create nodes here, generally by downloading data
  // from a remote API.

  await makeBlogNode({ contentType: 'blogPost', createNode });
  // Make changable headers
};
exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === 'build-html') {
    config.loader('null', {
      test: /bad-module/,
      loader: 'null-loader',
    });
  }
  // if (stage === 'build-javascript') {
  //   config.plugin(
  //     'remove-hljs-lang', webpack.ContextReplacementPlugin,
  //     [
  //       /highlight\.js\/lib\/languages$/,
  //       new RegExp(`^./(${['javascript', 'python', 'bash'].join('|')})$`),
  //     ],
  //   );
  //   config.plugin('ignore-moment-locale', webpack.IgnorePlugin, [/^\.\/locale$/, [/moment$/]]);
  // }
};
// exports.modifyBabelrc = ({ babelrc }) => ({
//   ...babelrc,
//   plugins: babelrc.plugins.concat(['transform-decorators-legacy', 'transform-regenerator', 'transform-runtime']),
// });

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    // const pages = []
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
            component: path.resolve("./src/templates/blog-post.js"),
            context: {
              slug: node.slug
            },
          })
        })
      })
    )
  })
}
