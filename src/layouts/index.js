import React from 'react'
import Head from './Head'
import '../assets/scss/main.scss'
import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'

if (typeof window !== 'undefined') {
    // Make scroll behavior of internal links smooth
    require('smooth-scroll')('a[href*="#"]', {
      offset: 60,
    });
  }

class Template extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMenuVisible: false,
            loading: 'is-loading'
        }
        this.handleToggleMenu = this.handleToggleMenu.bind(this)
    }

    componentDidMount () {
        this.timeoutId = setTimeout(() => {
            this.setState({loading: ''});
        }, 100);
    }

    componentWillUnmount () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    handleToggleMenu() {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible
        })
    }

    render() {
        const { children } = this.props
        return (
            <div className={`body ${this.state.loading} ${this.state.isMenuVisible ? 'is-menu-visible' : ''}`}>
                <Head />
                <div id="wrapper">
                    <Header onToggleMenu={this.handleToggleMenu} />
                    {children()}
                    <Footer />
                </div>
                <Menu onToggleMenu={this.handleToggleMenu} />
            </div>
        )
    }
}

Template.propTypes = {
    children: React.PropTypes.func
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

