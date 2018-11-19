import React from 'react'
import Helmet from 'react-helmet'
import { withPrefix } from 'gatsby-link'
import PropTypes from 'prop-types'

import '../assets/scss/main.scss'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'

class Template extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuVisible: false,
      loading: 'is-loading',
    }
    this.handleToggleMenu = this.handleToggleMenu.bind(this)
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ loading: '' })
    }, 100)
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  handleToggleMenu() {
    const { isMenuVisible } = this.state
    this.setState({
      isMenuVisible: !isMenuVisible,
    })
  }

  render() {
    const { children } = this.props
    const { loading, isMenuVisible } = this.state
    return (
      <div
        className={`body ${loading} ${
          isMenuVisible ? 'is-menu-visible' : ''
        }`}
      >
        <Helmet>
          <link rel="stylesheet" href={withPrefix('skel.css')} />
        </Helmet>
        <div id="wrapper">
          <Header onToggleMenu={this.handleToggleMenu} />
          {children}
          <Footer />
        </div>
        <Menu onToggleMenu={this.handleToggleMenu} />
      </div>
    )
  }
}

Template.propTypes = {
  children: PropTypes.array,
}

export default Template

// export const pageQuery = graphql`
//   query LayoutQuery {
//     allMarkdownRemark(limit: 1000) {
//         edges {
//         node {
//             frontmatter {
//             path
//             title
//             date(formatString: "MMMM DD, YYYY")
//             }
//         }
//     }
//     }
//   }
// `
