import React from 'react'
import Gitment from 'gitment'
import './style.css'

export default class GitmentComp extends React.Component {
  componentDidMount() {
    this.gitment = new Gitment({
      id: window.location.pathname,
      owner: 'LaughingJacky',
      repo: 'gitment',
      oauth: {
        client_id: '7d15c5c496b35e601dae',
        client_secret: '25fb2be35286f43cd6e59167fcd2b98c2dc5500f'
      },
    })
    this.gitment.render('gitment')
  }
  componentDidUpdate() {
    this.gitment = new Gitment({
      id: window.location.pathname,
      owner: 'LaughingJacky',
      repo: 'gitment',
      oauth: {
        client_id: '7d15c5c496b35e601dae',
        client_secret: '25fb2be35286f43cd6e59167fcd2b98c2dc5500f'
      },
    })
    this.gitment.render('gitment')
  }
  render() {
    return <div id='gitment' />
  }
}
