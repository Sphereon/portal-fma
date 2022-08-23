import React, { ReactElement } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Markdown from '../atoms/Markdown'
import styles from './HomeContent.module.css'
import Container from '../atoms/Container'
import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import HighlightBox from '../molecules/HighlightBox'

const query = graphql`
{
  file(absolutePath: {regex: "/content\\.json/"}) {
    childIndexJson {
      content {
        teaser {
          title
          text
        }
        points {
          text
        }
        firstTimeVisiting {
          title
          text
          buttonLabels {
            hide
            show
          }
        }
      }
    }
  }
}
`
interface HomeContentData {
  file: {
    childIndexJson: {
      content: {
        teaser: {
          title: string
          text: string
        }
        points: {
          text: string
        }[]
        firstTimeVisiting: {
          title: string
          text: string
          buttonLabels: {
            hide: string
            show: string
          }
        }
      }
    }
  }
}

export default function HomeContent({
  showOnboarding,
  setShowOnboarding
}: {
  showOnboarding: boolean
  setShowOnboarding: (value: boolean) => void
}): ReactElement {
  const data: HomeContentData = useStaticQuery(query)
  const { teaser, points, firstTimeVisiting } = data.file.childIndexJson.content

  return (
    <Container className={styles.wrapper}>
      <h2>{teaser.title}</h2>
      <div className={styles.container}>
        <div className={styles.teaser}>
          <Markdown text={teaser.text} />
        </div>
        <div className={styles.secondarySection}>
          <div className={styles.points}>
            {points.map((point, i) => (
              <span key={i}>
                <Checkmark className={styles.checkmark} />
                <Markdown className={styles.pointText} text={point.text} />
              </span>
            ))}
          </div>
          <HighlightBox
            icon="eye"
            title={firstTimeVisiting.title}
            body={firstTimeVisiting.text}
            buttonLabel={
              showOnboarding
                ? firstTimeVisiting.buttonLabels.hide
                : firstTimeVisiting.buttonLabels.show
            }
            onClick={() => setShowOnboarding(!showOnboarding)}
          />
        </div>
      </div>
    </Container>
  )
}
