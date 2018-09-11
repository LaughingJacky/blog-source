import React, { Component } from 'react'
// import Link from 'gatsby-link';
import Tag from '../../components/Tag'
import Helmet from 'react-helmet'

const Item = ({ url = '', title = '', publishDate = '' }) => (
  <li key={title}>
    <a href={url} to={url}>
      {title} ({publishDate})
    </a>
  </li>
)

const TagBlock = ({
  tag = 'tag', articles = [], isActive = false,
}) => {
  console.log(isActive)
  return (
    <div className="tag-block" id={tag}>
      <h3 style={{
        color: isActive ? '#77d7b9' : '#999'
      }}>{tag}:</h3>
      <ol>
      {
        articles.map(a => (
          <Item
            url={a.url}
            title={a.title}
            publishDate={a.publishDate}
            key={a.title}
          />
        ))
      }
      </ol>
    </div>
  )
}

class TagPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tCfy: {}
    }
  }
  componentWillMount() {
    const tCfy = {} // tagsClassify
    const { edges } = this.props.data.tags
    edges.forEach(({node: item}) => {
      const { title, slug, publishDate, tags } = item
      tags.forEach(t => {
        const entity = { title, url: `/blog/${slug}`, publishDate }
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
    const tags = Object.keys(tCfy).sort()
    return (
      <div id="main" className="tag-page alt">
        <Helmet>
          <title>博客列表</title>
          <meta name="description" content="Generic Page" />
        </Helmet>
        <section id="banner" className="style2">
          <div className="inner">
            <header className="major">
              <h1>文章分类<span className="tips">按标签分类</span></h1>
              <div className="tag-list">
                {
                  tags.map(item => (
                    <Tag
                      name={item}
                      count={tCfy[item].length}
                      key={item}
                    />
                  ))
                }
              </div>
            </header>
          </div>
        </section>
        <div className="content">
          {
            tags.map(t => {
              console.log(this.props.location.hash)
              return <TagBlock
                tag={t}
                articles={tCfy[t].filter((v, i, a) => a.indexOf(v) === i)}
                isActive={decodeURI(this.props.location.hash) === `#${t}`}
                key={t}
              />
            })
          }
        </div>
      </div>
    )
  }
}

export default TagPage
export const pageQuery = graphql`
  query myTags {
    tags: allContentfulBlogPost {
      edges {
        node {
          title
          tags
          slug
          publishDate(formatString: "MMMM Do, YYYY")
        }
      }
    }
  }
`
