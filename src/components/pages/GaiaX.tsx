import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import Button from '../atoms/Button'
import Container from '../atoms/Container'
import Markdown from '../atoms/Markdown'
import HighlightBox from '../molecules/HighlightBox'
import styles from './GaiaX.module.css'

const gaiaXPageQuery = graphql`
  query gaiaXPageQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/aboutGaiaX.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            title
            topSection {
              text
              cta {
                label
                link
              }
            }
            hero {
              header
              points
            }
            footer {
              text
              disclaimer
              cards {
                title
                body
                icon
              }
            }
            image {
              childImageSharp {
                original {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`
interface GaiaXContent {
  content: {
    edges: {
      node: {
        childPagesJson: {
          title: string
          topSection: {
            text: string
            cta: {
              label: string
              link: string
            }
          }[]
          hero: {
            header: string
            points: string[]
          }
          footer: {
            text: string
            disclaimer: string
            cards: {
              title: string
              body: string
              icon: string
            }[]
          }
          image: {
            childImageSharp: {
              original: {
                src: string
              }
            }
          }
        }
      }
    }[]
  }
}

export default function GaiaXPage(): ReactElement {
  const data: GaiaXContent = useStaticQuery(gaiaXPageQuery)
  const { content } = data
  const { title, topSection, hero, footer, image } =
    content.edges[0].node.childPagesJson

  return (
    <div className={styles.wrapper}>
      <div className={styles.media}>
        <img
          src={image.childImageSharp.original.src}
          className={styles.image}
        />
      </div>
      <Container className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {topSection.map((section, i) => (
          <div key={i} className={styles.section}>
            <Markdown text={section.text} />
            <Button
              style="primary"
              href={section.cta.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {section.cta.label}
            </Button>
          </div>
        ))}
      </Container>
      <div className={styles.heroWrapper}>
        <Container className={styles.heroContainer}>
          <Markdown className={styles.heroHeader} text={hero.header} />
          <ul>
            {hero.points.map((point, i) => (
              <li key={i}>
                <Markdown text={point} />
              </li>
            ))}
          </ul>
        </Container>
      </div>
      <Container className={styles.footerContainer}>
        <Markdown text={footer.text} />

        <Markdown text={footer.disclaimer} />
      </Container>
    </div>
  )
}
