import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { blogPostCfg } from '../../cfg'
import {
  addOnePage, minusOnePage, simplePages, complexPages, getPageNum,
} from './func'

const PageItem = ({ href, text, curPage }) => <li><Link className={`page ${curPage === text && 'active'}`} href={href} to={href}>{text}</Link></li>

const { maxPages } = blogPostCfg
const Pagination = ({ pathname }) => (
  <ul className="actions fit pagination">
    <li>
      <span
        className={getPageNum(pathname) === 1 ? 'button disabled' : 'button'}
        onClick={() => minusOnePage(getPageNum(pathname))}
      >
        Prev
      </span>
    </li>
    {
      maxPages < 5
        ? simplePages(maxPages).map((_, i) => <PageItem href={_} text={i + 1} curPage={getPageNum(pathname)} key={_} />)
        : complexPages(getPageNum(pathname), blogPostCfg).map((_) => {
          return _ === -1 ? <li key={_}><span>&hellip;</span></li> : <PageItem href={_} text={getPageNum(_)} curPage={getPageNum(pathname)} key={_} />
        })
    }
    <li>
      <span
        className={getPageNum(pathname) === maxPages ? 'button disabled' : 'button'}
        onClick={() => addOnePage(getPageNum(pathname), maxPages)}
      >
        Next
      </span>
    </li>
  </ul>
)

Pagination.propTypes = {
  pathname: PropTypes.string.isRequired,
}

PageItem.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.number.isRequired,
  curPage: PropTypes.number.isRequired,
}

export default Pagination
