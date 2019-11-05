import React from 'react'
import PropTypes from 'prop-types'
import './toc.scss'

const TableOfContent = ({ slug, toc }) => {
    const re = new RegExp(`href="`, 'g');
    const tocHTML = toc.replace(re, 'href=".');
    return (
        <div className="toc-container">
            <div className="post-toc"
                dangerouslySetInnerHTML={{__html: tocHTML}} />
        </div>
    )
}


TableOfContent.propTypes = {
  toc: PropTypes.string,
}

export default TableOfContent
