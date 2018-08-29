import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

const BlogList = (props) => (
    <div>
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
                    {
                        props.data.allContentfulBlogPost.edges.map(({node}, i) => {
                            const {slug, description, heroImage, tags, publishDate} = node
                            console.log(node)
                            return (
                                <section id="two" className="spotlights" key={i}>
                                    {
                                        i % 2 === 0 ? <section>
                                        <Link to={`/blog/${slug}`} className="image">
                                            <img src={heroImage.sizes.srcWebp} alt="" />
                                        </Link>
                                        <div className="content">
                                            <div className="inner">
                                                <header className="major">
                                                    <h3>{node.title}</h3>
                                                </header>
                                                <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna. Maecenas massa sed magna lacinia magna pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis tempus.</p>
                                                <ul className="actions">
                                                    <li><Link to={`/blog/${slug}`} className="button">Learn more</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        </section> : <section>
                                        <div className="content">
                                                <div className="inner">
                                                    <header className="major">
                                                        <h3>{node.title}</h3>
                                                    </header>
                                                    <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna. Maecenas massa sed magna lacinia magna pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis tempus.</p>
                                                    <ul className="actions">
                                                        <li><Link to={`/blog/${slug}`} className="button">Learn more</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <Link to={`/blog/${slug}`} className="image">
                                                <img src={heroImage.sizes.srcWebp} alt="" />
                                            </Link>
                                        </section>
                                    }
                                </section>
                            )

                        })
                    }
                </div>
            </section>
        </div>
    </div>
)

export default BlogList

export const pageQuery = graphql`
query BlogIndexQuery {
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulSizes_withWebp
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`
