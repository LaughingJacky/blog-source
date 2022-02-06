import React from 'react'
import { graphql, navigate } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'

import Layout from '../../components/Layouts'
import Card from '../../components/Card/index.tsx'

const draftList = [
  {
    name: '扫雷',
    path: '/minesweeper',
    description: 'simple minesweeper game',
    img: require('./minesweeper/assets/mine-smile.png'),
  },
]

const Draft = ({ data }) => {
  const siteTitle = get(data, 'site.siteMetadata.title')
  const siteDescription = get(data, 'site.siteMetadata.description')
  const cardClick = path => () => navigate(`/draft${path}`)
  return (
    <Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteDescription} />
      </Helmet>
      <div className="contain" style={{ paddingTop: 20 }}>
        {
          draftList.map(d => <Card key={d.path} imgSrc={d.img} cardName={d.name} onClick={cardClick(d.path)} label={d.description} />)
        }
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
    query DraftPage {
        site {
            siteMetadata {
                title
                description
            }
        }
    }
`
export default Draft
