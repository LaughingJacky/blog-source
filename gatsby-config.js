/* eslint max-len: 1 */
const dayjs = require('dayjs')
const Remarkable = require('remarkable')

const extractData = (site, edge) => {
  const url = `${site.siteMetadata.siteUrl}//${dayjs(edge.node.publishDate).format('YYYY/MM/DD')}/${edge.node.url}`

  const md = new Remarkable({})
  const description = md.render(edge.node.content)

  return {
    title: edge.node.title,
    description,
    date: dayjs(edge.node.createdDate).format('MMMM DD, YYYY, h:mm A'),
    url,
    guid: url,
  }
}

module.exports = {
  siteMetadata: {
    title: '王晓博 - 银河系漫游指南',
    author: 'Shawb Wong',
    siteUrl: process.env.HOST_SERVER === 'now' ? 'https://shawb-wong.now.sh' : 'https://laughingjacky.netlify.com',
    description: '如果这个博客好久不更新了,说明我更浑浑噩噩了',
  },
  pathPrefix: '/',
  // pathPrefix: '/shawb-wong',
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-sitemap',
    },
    {
      resolve: 'gatsby-plugin-nprogress',
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title,
                description,
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allContetfulBlogPost } }) => allContetfulBlogPost.edges.map(edge => extractData(site, edge)),
            query: `
              {
                allContetfulBlogPost(
                  limit: 10
                  sort: {fields: [publishDate], order: DESC}
                ) {
                  edges {
                    node {
                      title
                      description
                      headImg
                      publishDate
                    }
                  }
                }
              }
            `,
            output: '/feed.xml',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "Shawb's Blog",
        short_name: 'Shawb',
        start_url: '/',
        background_color: '#ededed',
        theme_color: '#384f7c',
        display: 'standalone',
        icons: [{
          src: '/favicons/Mikoto-145*145.png',
          sizes: '192x192',
          type: 'image/png',
        }],
      },
    },
    'gatsby-plugin-offline', // put this after gatsby-plugin-manifest
    'gatsby-plugin-netlify', // make sure to put last in the array
  ],
}
