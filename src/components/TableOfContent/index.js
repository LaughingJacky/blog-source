import React from 'react'
import PropTypes from 'prop-types'
import './toc.scss'

const TableItem = ({ url, name }) => (
  <li>
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
    {items.map(item => <TableItem url={`#${item}`} name={item} key={item} />)}
  </ul>
)

const TableOfContent = ({ toc }) => (
  <div className="toc-container">
    <Table items={toc} />
  </div>
)

Table.propTypes = {
  items: PropTypes.object,
}

TableOfContent.propTypes = {
  toc: PropTypes.object,
}

export default TableOfContent
