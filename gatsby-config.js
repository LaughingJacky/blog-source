/* eslint max-len: 1 */
module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: '王晓博 - 银河系漫游指南',
    author: 'Shawb Wong',
    siteUrl: process.env.HOST_SERVER === 'now' ? 'https://shawb-wong.now.sh' : 'https://laughingjacky.netlify.com',
    description: '如果这个博客好久不更新了,说明我更浑浑噩噩了',
  },
  // pathPrefix: '/shawb-wong',
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-sharp',
      options: {
        checkSupportedExtensions: false,
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/content`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          'gatsby-remark-images',
          'gatsby-remark-prismjs',
          'gatsby-remark-external-links',
        ],
        tableOfContents: {
          heading: null,
          maxDepth: 6,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
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
