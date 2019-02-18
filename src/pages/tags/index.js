import React, { Component } from 'react'
// import Link from 'gatsby-link';
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { getUrl } from '../../api'

import Tag from '../../components/Tag/index'
import Layout from '../../components/Layouts/index'

const Item = ({ url = '', title = '', publishDate = '' }) => (
  <li key={title}>
    <a href={url} to={url}>
      {title}
      (
      {publishDate}
      )
    </a>
  </li>
)

Item.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired
}


const TagBlock = ({ tag = 'tag', articles = [], isActive = false }) => (
  <div className="tag-block" id={tag}>
    <h3
      style={{
        color: isActive ? '#77d7b9' : '#999',
      }}
    >
      {tag}
      :
    </h3>
    <ol>
      {articles.map(a => (
        <Item
          url={getUrl(a.publishDate, a.title)}
          title={a.title}
          publishDate={a.formattedDate}
          key={a.title}
        />
      ))}
    </ol>
  </div>
)

TagBlock.propTypes = {
  tag: PropTypes.string.isRequired,
  articles: PropTypes.array.isRequired,
  isActive: PropTypes.bool.isRequired,
}

class TagPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tCfy: {},
    }
  }

  componentWillMount() {
    const tCfy = {} // tagsClassify
    const { data } = this.props
    const { edges } = data.tags
    edges.forEach(({ node: item }) => {
      const {
        title, slug, publishDate, tags, formattedDate
      } = item
      tags.forEach((t) => {
        const entity = { title, url: `/blog/${slug}`, publishDate, formattedDate }
        if (tCfy[t]) {
          tCfy[t].push(entity)
        } else {
          tCfy[t] = [entity]
        }
      })
    })
    this.setState({ tCfy })
  }

  render() {
    const { tCfy } = this.state
    const { location } = this.props
    const tags = Object.keys(tCfy).sort()
    return (
      <Layout>
        <div id="main" className="tag-page alt">
          <Helmet>
            <title>博客列表</title>
            <meta name="description" content="Generic Page" />
          </Helmet>
          <section id="banner" className="style2">
            <div className="inner">
              <header className="major">
                <h1>
                  文章分类
                  <span className="tips">按标签分类</span>
                </h1>
                <div className="tag-list">
                  {tags.map(item => (
                    <Tag name={item} count={tCfy[item].length} key={item} />
                  ))}
                </div>
              </header>
            </div>
          </section>
          <div className="content">
            {tags.map(t => (
              <TagBlock
                tag={t}
                articles={tCfy[t].filter((v, i, a) => a.indexOf(v) === i)}
                isActive={decodeURI(location.hash) === `#${t}`}
                key={t}
              />
            ))}
          </div>
        </div>
      </Layout>
    )
  }
}

TagPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
}

export default TagPage
export const pageQuery = graphql`
  query myTags {
    tags: allContetfulBlogPost {
      edges {
        node {
          title
          tags
          slug
          publishDate
          formattedDate: publishDate(formatString: "MMMM Do, YYYY")
        }
      }
    }
  }
`
