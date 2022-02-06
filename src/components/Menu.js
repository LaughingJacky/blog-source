import React from 'react'
import Link from 'gatsby-link'
import PropTypes from 'prop-types'

import { menuList } from '../../cfg'

const Menu = ({ onToggleMenu }) => (
  <nav id="menu">
    <div className="inner">
      <ul className="links">
        {menuList.map(item => (
          <li key={item.text}>
            <Link onClick={onToggleMenu} to={item.href}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <span className="close" onClick={onToggleMenu}>
      Close
    </span>
  </nav>
)

Menu.propTypes = {
  onToggleMenu: PropTypes.func,
}

export default Menu
