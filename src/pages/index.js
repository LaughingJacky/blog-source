import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import {Helmet} from 'react-helmet'
import 'gitalk/dist/gitalk.css'
import get from 'lodash/get'

import {isBrowser, getUrl} from '../api'
import Layout from '../components/Layouts/index'
import Banner from '../components/Banner'

import pic04 from '../assets/images/pic04.jpg'
import pic06 from '../assets/images/pic06.jpg'

// Prevent webpack window problem
const Gitalk = isBrowser ? require('gitalk') : undefined

const Article = ({ slug, data }) => (<article
    style={{ backgroundImage: `url(${data.headerImage})` }}
>
    <header className="major">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
    </header>
    <Link to={getUrl(data.date, slug)} className="link primary" />
</article>)

const HomeIndex = ({ data }) => {
    useEffect(() => {
        const gitalk = new Gitalk({
            clientID: GITALK_ID,
            clientSecret: GITALK_SECRET,
            repo: 'gitalk',
            owner: 'LaughingJacky',
            admin: ['LaughingJacky'],
            distractionFreeMode: true,
        })
        gitalk.render('gitalk-container')
    })

    const siteTitle = get(data, 'site.siteMetadata.title')
    const siteDescription = get(data, 'site.siteMetadata.description')
    const latestPosts = get(data, 'latestPosts.edges')
    return (
        <Layout>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />
                <meta name="keywords" content={siteDescription} />
            </Helmet>

            <Banner />

            <div id="main">
                <section id="one" className="tiles">
                    <article style={{ backgroundImage: `url(${pic04})` }}>
                        <header className="major">
                            <h3>文章列表</h3>
                        </header>
                        <Link to="/blog-list/1" className="link primary" />
                    </article>
                    <article style={{ backgroundImage: `url(${pic06})` }}>
                        <header className="major">
                            <h3>标签</h3>
                        </header>
                        <Link to="/tags" className="link primary" />
                    </article>
                    {latestPosts.map(({ node }) => <Article key={node.id} slug={node.fields.slug} data={node.frontmatter} />)}
                </section>
            </div>
            <div id="gitalk-container" />
        </Layout>
    )
}

export default HomeIndex

export const pageQuery = graphql`
    query HomePage {
        latestPosts: allMarkdownRemark(
            limit: 4,
            sort: {fields: frontmatter___date, order: DESC}
        ) {
            edges {
                node {
                    id
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        description
                        headerImage
                        date
                    }
                }
            }
        }
        site {
            siteMetadata {
                title
                description
            }
        }
    }
`
