import React from 'react'
import PropTypes from 'prop-types'
import Head from './Head'
import '../../assets/scss/main.scss'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'

if (typeof window !== 'undefined') {
  // Make scroll behavior of internal links smooth
  require('smooth-scroll')('a[href*="#"]', {
    offset: 60,
  })
}

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
        <Head />
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
  children: PropTypes.func,
}

export default Template
