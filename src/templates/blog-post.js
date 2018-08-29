import React from 'react'
import Helmet from 'react-helmet'
import 'gitalk/dist/gitalk.css'
import get from 'lodash/get'
import { getPath } from '../api/'
import md5 from 'md5'
import moment from 'moment'

// Prevent webpack window problem
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    const content = get(this.props, 'data.content')
    const issueDate = '2018-08-29'
    let id = getPath()
    let title = document ? document.title : ''
    if (moment(content.publishDate).isAfter(issueDate)) {
      title = `${content.title} | Shawb's Blog`
      id = md5(content.title)
    }
    const gitalk = new Gitalk({
      clientID: '7d15c5c496b35e601dae',
      clientSecret: '25fb2be35286f43cd6e59167fcd2b98c2dc5500f',
      repo: 'Gitment',
      owner: 'LaughingJacky',
      admin: ['LaughingJacky'],
      distractionFreeMode: true,
      title,
      id
    })
    gitalk.render('gitalk-container')
  }
  render() {
    const post = get(this.props, 'data.content')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    return (
      <div className="blog-post">
        <Helmet title={`${post.title} | ${siteTitle}`} />
        <section id="banner">
          <div className="inner">
            <header className="major">
              <h1>{post.title}</h1>
            </header>
            <div className="content">
              <div dangerouslySetInnerHTML={{ __html: post.description.childMarkdownRemark.html }} />
              <p className="tag">{post.publishDate}</p>
            </div>
          </div>
        </section>
        <div className="container" dangerouslySetInnerHTML={{ __html: post.body.childMarkdownRemark.html }} />
        <hr/>
        <div id="gitalk-container" />
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    content: contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "MMMM Do, YYYY")
      tags
      description {
        childMarkdownRemark {
          html
        }
      }
      heroImage {
        sizes(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulSizes_withWebp
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
