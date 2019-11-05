import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import dayjs from 'dayjs';
import { isBrowser, getUrl } from '../api'
import Pagination from '../components/Pagination/index'
import Layout from '../components/Layouts/index'

const BlogList = ({pageContext}) => <Layout>
    <div className="page-blog-list">
        <Helmet title="文章列表" />
        <div id="main" className="alt">
            <section id="one">
                <div className="inner">
                    <header className="major">
                        <h1>文章列表</h1>
                    </header>
                    {pageContext.group.map(({ node }) => {
                        const {
                            description, headerImage: headImg, date: publishDate, title
                        } = node.frontmatter
                        return (
                            <section id="two" className="spotlights" key={title}>
                                <section>
                                    <Link to={getUrl(publishDate, node.fields.slug)} className="image">
                                        <img src={headImg} alt="" />
                                    </Link>
                                    <div className="content">
                                        <div className="inner">
                                            <Link to={getUrl(publishDate, node.fields.slug)}>
                                                <header className="major">
                                                    <h3 className="one-line">
                                                        <span className="pub-date">{dayjs(publishDate).format('YYYY年MM月DD日')}</span>
                                                        <span>{title}</span>
                                                    </h3>
                                                </header>
                                                <p className="desc">{description}</p>
                                            </Link>
                                            <ul className="actions">
                                                <li>
                                                    <Link to={getUrl(publishDate, node.fields.slug)} className="button">
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
            <Pagination articleNum={pageContext.additionalContext.pagesLength} pathname={isBrowser() ? window.location.pathname : ''} />
        </div>
    </div>
</Layout>


BlogList.propTypes = {
    data: PropTypes.object,
}

export default BlogList
