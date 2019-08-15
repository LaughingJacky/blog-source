import React from 'react'
import PropTypes from 'prop-types'
import './toc.scss'

const TableItem = ({ level, url, name }) => (
  <li className={[3, 4].indexOf(level) > -1 ? 'sub-toc' : ''}>
    <a
      href={url}
      data-scroll
    >
      {name}
    </a>
  </li>
)

TableItem.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const Table = ({ items }) => (
  <ul>
    {items.map(item => <TableItem level={item.l} url={`#${item.id}`} name={item.id} key={item.id} />)}
  </ul>
)

const TableOfContent = ({ toc }) => (
  <div className="toc-container">
    <Table items={toc} />
  </div>
)

Table.propTypes = {
  items: PropTypes.array,
}

TableOfContent.propTypes = {
  toc: PropTypes.array,
}

export default TableOfContent
