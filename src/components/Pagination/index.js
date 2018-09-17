import React from 'react'
import PropTypes from 'prop-types'

import Link, { push } from 'gatsby-link'
import { blogPostCfg } from '../../cfg'

const parsePageUrl = (index) => {
  if (index > 0) {
    push(`/blogList/${index}`)
  }
  if (index === 0) {
    push('/blogList/1')
  }
  return -1
}

const getPageNum = pathname => +pathname.split('/')[2]

const minusOnePage = (curPage) => {
  if (curPage - 1 >= 1) {
    return parsePageUrl(curPage - 1)
  }
  return false
}

const addOnePage = (curPage) => {
  if (curPage + 1 <= blogPostCfg.maxPages) {
    return parsePageUrl(curPage + 1)
  }
  return -1
}


const getPages = () => new Array(blogPostCfg.maxPages).fill().map((_, index) => `/blogList/${index + 1}`)
const complexPages = (curPage) => {
  const pagesArr = []
  const { pageBufferSize, maxPages } = blogPostCfg
  let curLeft = Math.max(1, curPage - pageBufferSize)
  let curRight = Math.min(curPage + pageBufferSize, maxPages)
  // let isBig = Math.min(maxPages / 2) > 5
  if (curPage - 1 <= pageBufferSize) {
    curRight = 1 + pageBufferSize * 2
  }
  if (maxPages - curPage <= pageBufferSize) {
    curLeft = maxPages - pageBufferSize * 2
  }
  // left arr
  // -1 is ... flag
  if (curLeft - 1 > 1) {
    pagesArr.push([`/blogList/${1}`, -1])
    const midArr = []
    for (let i = curLeft; i <= curRight; i += 1) {
      midArr.push(`/blogList/${i}`)
    }
    pagesArr.push(midArr)
  } else {
    const leftArr = []
    for (let i = 1; i <= curRight; i += 1) {
      leftArr.push(`/blogList/${i}`)
    }
    pagesArr.push(leftArr)
  }

  // right arr
  if (maxPages - 1 > curRight) {
    pagesArr.push([-1, `/blogList/${maxPages}`])
  } else if (maxPages === curRight + 1) {
    pagesArr[pagesArr.length - 1].push(`/blogList/${maxPages}`)
  }
  return pagesArr
}

const PageItem = ({ href, text, curPage }) => <li><Link className={`page ${curPage === text && 'active'}`} href={href} to={href}>{text}</Link></li>

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
      blogPostCfg.maxPages < 5
        ? getPages().map((_, i) => <PageItem href={_} text={i + 1} curPage={getPageNum(pathname)} key={_} />)
        : complexPages(getPageNum(pathname)).map(pA => (
          pA.map((_) => {
            return _ === -1 ? <li><span>&hellip;</span></li> : <PageItem href={_} text={getPageNum(_)} curPage={getPageNum(pathname)} key={_} />
          })
        ))
    }
    {/* <li>
      <span>&hellip;</span>
    </li> */}
    <li>
      <span
        className={getPageNum(pathname) === blogPostCfg.maxPages ? 'button disabled' : 'button'}
        onClick={() => addOnePage(getPageNum(pathname))}
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
