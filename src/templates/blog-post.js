import React, {useEffect} from 'react'
import { navigate, graphql } from 'gatsby'
import {Helmet} from 'react-helmet'
import 'gitalk/dist/gitalk.css'
import get from 'lodash/get'
import md5 from 'md5'

import {isBrowser} from '../api';
import Layout from '../components/Layouts/index'
import Tag from '../components/Tag/index'
import TableOfContent from '../components/TableOfContent/index'

// Prevent webpack window problem
const Gitalk = isBrowser ? require('gitalk') : undefined

const BlogPostTemplate = ({location, data}) => {
    useEffect(() => {
        if (location.pathname.slice(-1) !== '/') {
            navigate(`${location.pathname}/${location.hash}`);
        }
        else {
            const content = get(data, 'content.edges[0].node.frontmatter')
            const gitalk = new Gitalk({
                clientID: GITALK_ID,
                clientSecret: GITALK_SECRET,
                repo: 'gitalk',
                owner: 'LaughingJacky',
                admin: ['LaughingJacky'],
                distractionFreeMode: true,
                title: `${content.title} | Shawb's Blog`,
                id: md5(content.title)
            })
            gitalk.render('gitalk-container')
        }
    }, []);

    const post = get(data, 'content.edges[0].node')
    const siteTitle = get(data, 'site.siteMetadata.title')
    const {
      tags, date: publishDate, title, description, headerImage
    } = post.frontmatter

    return <Layout>
        <div className="blog-post">
            <Helmet>
                <title>{`${title} | ${siteTitle}`}</title>
                <meta name="description" content={description} />
                <meta name="og:description" content={description} />
                <meta name="keywords" content={tags} />
            </Helmet>
            <section
                id="banner"
                style={{
                    backgroundImage: `url(${headerImage})`,
                }}
            >
                <div className="inner">
                    <header className="major">
                        <h1>{title}</h1>
                        <p className="date">{publishDate}</p>
                    </header>
                    <div className="content">
                        <p>{description}</p>
                        <div className="tags">
                            {
                                tags && tags.map(tag => <Tag name={tag} key={tag} />)
                            }
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="main" dangerouslySetInnerHTML={{ __html: post.html }} />
                <TableOfContent slug={post.fields.slug} toc={post.tableOfContents} />
            </div>
            <hr />
            <div id="gitalk-container" />
        </div>
    </Layout>
}

export default BlogPostTemplate

export const pageQuery = graphql`
    fragment post on MarkdownRemark {
        frontmatter {
            id
            description
            title
            slug
            date(formatString: "YYYY年MM月DD日")
            tags
            headerImage
        }
    }
    query BlogPostQuery($index: Int) {
        content: allMarkdownRemark(
            sort: { order: DESC, fields: frontmatter___date }
            skip: $index
            limit: 1
        ) {
            edges {
                node {
                    id
                    html
                    fields {
                        slug
                    }
                    tableOfContents(maxDepth: 6, pathToSlugField: "frontmatter.slug")
                    ...post
                }

                previous {
                    ...post
                }

                next {
                    ...post
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
