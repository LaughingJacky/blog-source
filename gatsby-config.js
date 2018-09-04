let contentfulConfig

try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful')
} catch (_) {}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.'
  )
}

module.exports = {
  siteMetadata: {
    title: "王晓博 - 银河系漫游指南",
    author: "Shawb Wong",
    description: "如果这个博客好久不更新了,说明我更浑浑噩噩了"
  },
  pathPrefix: '/',
  // pathPrefix: '/shawb-wong',
  plugins: [
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-sass`,
    // 'gatsby-plugin-sharp',
    // {
    //   resolve: 'gatsby-source-contentful',
    //   options: contentfulConfig,
    // },
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
          type: 'image/png'
        }]
      }
    }
  ],
}
