import { push } from 'gatsby-link'

const parsePageUrl = (index) => {
  if (index > 0) {
    push(`/blogList/${index}`)
  }
  if (index === 0) {
    push('/blogList/1')
  }
  return -1
}

const minusOnePage = (curPage) => {
  if (curPage - 1 >= 1) {
    return parsePageUrl(curPage - 1)
  }
  return false
}

const addOnePage = (curPage, maxPages) => {
  if (curPage + 1 <= maxPages) {
    return parsePageUrl(curPage + 1)
  }
  return -1
}


const getPageNum = pathname => +pathname.split('/')[2]

const simplePages = maxPages => new Array(maxPages).fill().map((_, index) => `/blogList/${index + 1}`)

const complexPages = (curPage, cfg) => {
  let pagesArr = []
  const { pageBufferSize, maxPages } = cfg

  // 确定左右边界
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
    // 显示第一页码和...
    const tempArr = [`/blogList/${1}`, -1]

    // 显示当前页码段
    for (let i = curLeft; i <= curRight; i += 1) {
      tempArr.push(`/blogList/${i}`)
    }
    [].push.apply(pagesArr, tempArr)
  } else {
    // 第一页码和当前段合并
    for (let i = 1; i <= curRight; i += 1) {
      pagesArr.push(`/blogList/${i}`)
    }
  }
  // right arr
  if (maxPages - 1 > curRight) {
    // 显示最后页码和...
    [].push.apply(pagesArr, [-1, `/blogList/${maxPages}`])
  } else if (maxPages === curRight + 1) {
    // 最后页码和当前段链接
    pagesArr.push(`/blogList/${maxPages}`)
  }
  return pagesArr
}

export {
  minusOnePage,
  addOnePage,
  getPageNum,
  simplePages,
  complexPages,
}
