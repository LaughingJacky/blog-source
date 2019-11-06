import React from 'react'
import { withPrefix } from 'gatsby-link'
import { Helmet } from 'react-helmet'
import { headConfig } from '../../../cfg'

const Head = () => (
    <Helmet
        defaultTitle="Shawb's Blog"
        titleTemplate="%s | Shawb's Blog"
    >
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={headConfig.meta.description} />
        <meta name="keyword" content={headConfig.meta.keyword} />
        <meta name="theme-color" content={headConfig.meta.theme_color} />
        <meta name="msapplication-navbutton-color" content={headConfig.meta.theme_color} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content={headConfig.meta.theme_color} />
        <link rel="shortcut icon" href={headConfig.meta.favicon || 'https://cdn4.iconfinder.com/data/icons/emoji-18/61/4-512.png'} />
        {/* <meta name="google-site-verification" content={config.meta.google_site_verification} /> */}
        <link rel="stylesheet" href={withPrefix('skel.css')} />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/gruvbox-dark.min.css"
        />
    </Helmet>
)

export default Head
