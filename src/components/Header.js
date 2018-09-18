import React from 'react'
import Link from 'gatsby-link'
import PropTypes from 'prop-types'

const Header = ({ onToggleMenu }) => (
  <header id="header" className="alt">
    <Link to="/" className="logo">
      <strong>王晓博</strong>
      <span>Shawb Wong</span>
    </Link>
    <nav>
      <a className="menu-link" onClick={onToggleMenu} href="javascript:void(0);">
        Menu
      </a>
    </nav>
  </header>
)

Header.propTypes = {
  onToggleMenu: PropTypes.func,
}

export default Header
