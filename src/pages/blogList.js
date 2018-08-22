import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import pic11 from '../assets/images/pic11.jpg'
import pic08 from '../assets/images/pic08.jpg'
import pic09 from '../assets/images/pic09.jpg'
const BlogList = (props) => (
    <div>
        <Helmet>
            <title>博客列表 - Forty by HTML5 UP</title>
            <meta name="description" content="Generic Page" />
        </Helmet>


        <div id="main" className="alt">
            <section id="one">
                <div className="inner">
                    <header className="major">
                        <h1>Generic</h1>
                    </header>
                    {
                        props.data.allMarkdownRemark.edges.map((e, i) => {
                            console.log(e)
                            const article = e.node.frontmatter
                            return (
                                <section id="two" className="spotlights" key={i}>
                                    {
                                        i % 2 === 0 ? <section>
                                        <Link to={e.node.frontmatter.path} className="image">
                                            <img src={article.thumbnail} alt="" />
                                        </Link>
                                        <div className="content">
                                            <div className="inner">
                                                <header className="major">
                                                    <h3>{e.node.frontmatter.title}</h3>
                                                </header>
                                                <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna. Maecenas massa sed magna lacinia magna pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis tempus.</p>
                                                <ul className="actions">
                                                    <li><Link to={e.node.frontmatter.path} className="button">Learn more</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        </section> : <section>
                                        <div className="content">
                                                <div className="inner">
                                                    <header className="major">
                                                        <h3>{e.node.frontmatter.title}</h3>
                                                    </header>
                                                    <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna. Maecenas massa sed magna lacinia magna pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis tempus.</p>
                                                    <ul className="actions">
                                                        <li><Link to={e.node.frontmatter.path} className="button">Learn more</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <Link to={e.node.frontmatter.path} className="image">
                                                <img src={article.thumbnail} alt="" />
                                            </Link>
                                        </section>
                                    }
                                </section>
                            )

                        })
                    }
                    <span className="image main"><img src={pic11} alt="" /></span>
                </div>
            </section>
        </div>
    </div>
)

export default BlogList

export const pageQuery = graphql`
  query LayoutQuery {
    allMarkdownRemark(limit: 1000) {
        edges {
            node {
                tableOfContents
                frontmatter {
                path
                title
                date(formatString: "MMMM DD, YYYY")
                thumbnail
                }
            }
        }
    }
  }
`
