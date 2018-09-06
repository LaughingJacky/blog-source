import React from 'react'
import Link from 'gatsby-link'
import { menuList } from '../cfg'

const Menu = (props) => (
    <nav id="menu">
        <div className="inner">
            <ul className="links">
                {
                    menuList.map(item => (
                        <li><Link onClick={props.onToggleMenu} to={item.href}>{item.text}</Link></li>
                    ))
                }
            </ul>
            {/* <ul className="actions vertical">
                <li><a href="#" className="button special fit">Get Started</a></li>
                <li><a href="#" className="button fit">Log In</a></li>
            </ul> */}
        </div>
        <a className="close" onClick={props.onToggleMenu} href="javascript:;">Close</a>
    </nav>
)

Menu.propTypes = {
    onToggleMenu: React.PropTypes.func
}

export default Menu
