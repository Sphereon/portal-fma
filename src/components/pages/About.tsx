import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import Container from '../atoms/Container'
import Markdown from '../atoms/Markdown'
import Partners from '../organisms/Partners'
import styles from './About.module.css'

const aboutPageQuery = graphql`
  query aboutPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/aboutDemo.json" } }) {
      edges {
        node {
          childPagesJson {
            header {
              title
              body
            }
            footer {
              title
              body
              contacts {
                name
                image {
                  childImageSharp {
                    original {
                      src
                    }
                  }
                }
                text
                cta {
                  label
                  link
                }
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
interface AboutContent {
  content: {
    edges: {
      node: {
        childPagesJson: {
          header: {
            title: string
            body: string
          }
          footer: {
            title: string
            body: string
            contacts: {
              name: string
              image: {
                childImageSharp: {
                  original: {
                    src: string
                  }
                }
              }
              text: string
              cta: {
                label: string
                link: string
              }
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

export default function AboutPage(): ReactElement {
  const data: AboutContent = useStaticQuery(aboutPageQuery)
  const { content } = data
  const { header, footer, image } = content.edges[0].node.childPagesJson

  return (
    <div className={styles.wrapper}>
      <Container className={styles.mainContainer}>
        <div className={styles.main}>
          <div className={styles.content}>
            <h2 className={styles.title}>{header.title}</h2>
            <Markdown className={styles.body} text={header.body} />
          </div>
          <div className={styles.media}>
            <img
              src={image.childImageSharp.original.src}
              className={styles.image}
            />
          </div>
        </div>
      </Container>
      <div className={styles.partnersWrapper}>
        <Container className={styles.partnersContainer}>
          <h2 className={styles.partnersTitle}>Founding Partners:</h2>
          <Partners className={styles.partners} />
        </Container>
      </div>
      <Container className={styles.contactsContainer}>
        <h2 className={styles.title}>{footer.title}</h2>
        <Markdown className={styles.body} text={footer.body} />
        <div className={styles.contacts}>
          {footer.contacts.map((e, i) => (
            <div className={styles.contact} key={i}>
              <img src={e.image.childImageSharp.original.src} />
              <div className={styles.contactDetails}>
                <h4>{e.name}</h4>
                <Markdown className={styles.contactText} text={e.text} />
                <a href={e.cta.link}>{e.cta.label}</a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
