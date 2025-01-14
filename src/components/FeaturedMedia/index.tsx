import Link from 'next/link'
import { IoMdInformationCircleOutline } from 'react-icons/io'

import { IFeaturedMedia } from '../../@types'
import { Button } from '../Button'
import styles from './styles.module.scss'

interface IFeaturedMediaProps {
  genre?: string
  media: IFeaturedMedia
}

export function FeaturedMedia({ genre, media }: IFeaturedMediaProps) {
  return (
    <div
      className={styles.featuredMedia}
      style={{ backgroundImage: `url(${media?.backdrop_path?.original})` }}
      data-testid="featured-media"
    >
      <div className={styles.featuredMediaInfo}>
        {genre && <h1 className={styles.featuredMediaGenre}>Genre: {genre}</h1>}

        <div className={styles.featuredMediaInfoText}>
          <h1 className={styles.featuredMediaTitle}>{media.title}</h1>
          {media?.overview && <p className={styles.featuredMediaText}>{media.overview}</p>}
        </div>

        <div className={styles.featuredMediaInfoActions}>
          <Link
            href={`/details/${media.media_type}/${media.id}`}
            passHref
          >
            <Button
              color="secondary"
              icon={<IoMdInformationCircleOutline />}
              data-testid="more-details-button"
            >
              More details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
