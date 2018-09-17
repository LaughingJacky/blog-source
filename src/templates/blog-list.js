import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import Pagination from '../components/Pagination'

const BlogList = ({ data = {} }) => (
  <div className="page-blog-list">
    <Helmet>
      <title>博客列表</title>
      <meta name="description" content="Generic Page" />
    </Helmet>

    <div id="main" className="alt">
      <section id="one">
        <div className="inner">
          <header className="major">
            <h1>博客列表</h1>
          </header>
          {data.allContentfulBlogPost.edges.map(({ node }) => {
            const {
              slug, description, headImg, publishDate, title,
            } = node
            return (
              <section id="two" className="spotlights" key={title}>
                <section>
                  <Link to={`/blog/${slug}`} className="image">
                    <img src={headImg} alt="" />
                  </Link>
                  <div className="content">
                    <div className="inner">
                      <header className="major">
                        <h3 className="one-line">
                          <span className="pub-date">{publishDate}</span>
                          <span>{title}</span>
                        </h3>
                      </header>
                      <p className="desc">{description}</p>
                      <ul className="actions">
                        <li>
                          <Link to={`/blog/${slug}`} className="button">
                            Learn more
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </section>
            )
          })}
        </div>
      </section>
      <Pagination pathname={window.location.pathname} />
    </div>
  </div>
)

BlogList.propTypes = {
  data: PropTypes.object,
}

export default BlogList

export const pageQuery = graphql`
  query BlogIndexQuery($limit: Int, $skip: Int) {
    allContentfulBlogPost(
      sort: { fields: [publishDate], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          headImg
          description
        }
      }
    }
  }
`
