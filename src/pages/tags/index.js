import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { getUrl } from '../../api'

import Tag from '../../components/Tag/index'
import Layout from '../../components/Layouts/index'

const Item = ({ url = '', title = '', publishDate = '' }) => (
  <li
    key={title}
  >
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
  publishDate: PropTypes.string.isRequired,
}


const TagBlock = ({ tag = 'tag', articles = [], hash }) => (
  <div className="tag-block" id={tag}>
    <h3 style={{
      color: decodeURI(hash) === `#${tag}` ? '#77d7b9' : '#999',
    }}
    >
      {tag}
    </h3>
    <ol>
      {articles.map(a => (
        <Item
          url={getUrl(a.publishDate, a.slug)}
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
  hash: PropTypes.string.isRequired,
}

const TagPage = ({ data, location }) => {
  const [tagClassify, setTagClassify] = useState({})
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const tCfy = {} // tagsClassify
    const { edges } = data.tags
    edges.forEach(({ node }) => {
      const { slug } = node.fields
      const {
        title, publishDate, tags, formattedDate,
      } = node.frontmatter
      tags.forEach((t) => {
        const entity = {
          title, slug, publishDate, formattedDate,
        }
        if (tCfy[t]) {
          tCfy[t].push(entity)
        } else {
          tCfy[t] = [entity]
        }
      })
    })
    setTagClassify(tCfy)
  }, [])
  const tags = Object.keys(tagClassify).sort()
  return (
    <Layout>
      <div id="main" className="tag-page alt">
        <Helmet
          title="标签云"
          meta={[
            {
              name: 'description',
              content: tags.toString(),
            },
            {
              name: 'keywords',
              content: tags.toString(),
            },
            {
              name: 'og:description',
              content: tags.toString(),
            },
          ]}
        />
        <section id="banner" className="style2">
          <div className="inner">
            <header className="major">
              <h1>
                文章分类
                <span className="tips">按标签分类</span>
              </h1>
              <div className="tag-list">
                {tags.map(item => (
                  <Tag
                    onClick={() => {
                      setHash(`#${item}`)
                    }}
                    name={item}
                    count={tagClassify[item].length}
                    key={item}
                  />
                ))}
              </div>
            </header>
          </div>
        </section>
        <div className="content">
          {tags.map(t => (
            <TagBlock
              hash={hash}
              tag={t}
              articles={tagClassify[t].filter((v, i, a) => a.indexOf(v) === i)}
              key={t}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}


TagPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
}

export default TagPage

export const pageQuery = graphql`
    query myTags {
        tags: allMarkdownRemark {
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        tags
                        formattedDate: date(formatString: "YYYY年MM月DD日")
                        publishDate: date
                    }
                }
            }
        }
    }
`
