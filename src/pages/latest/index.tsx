import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import { IMedia } from '../../@types'
import { CardsSkeletonLoader } from '../../components/CardsSkeletonLoader'
import { EmptyState } from '../../components/EmptyState'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { MediaCarouselCard } from '../../components/MediaCarousel/MediaCarouselCard'
import { useOnScreen } from '../../hooks/useOnScreen'
import { tmdbService } from '../../services/tmdb'
import { normalizeMediaPayload } from '../../utils/functions'
import styles from './styles.module.scss'

interface ILatestProps {
  mediaFirstList?: IMedia[]
}

export default function Latest ({ mediaFirstList = [] }: ILatestProps) {
  const [currentPage, setCurrentPage] = useState(2)
  const [mediaList, setMediaList] = useState(mediaFirstList)
  const [hasMore, setHasMore] = useState(true)
  const [statusRequest, setStatusRequest] = useState('loading')
  const footerRef = useRef<HTMLDivElement | null>(null)
  const { isIntersecting } = useOnScreen(footerRef, 500)

  function resetList () {
    setCurrentPage(2)
    setMediaList([])
    setHasMore(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        currentPage === 2 ? setStatusRequest('loading') : setStatusRequest('loadmore')

        const res = await tmdbService.getTrendings({ page: currentPage })
        const results = res.data.results.map((media: IMedia) => normalizeMediaPayload(media))

        setMediaList((oldMediaList) => [...oldMediaList, ...results.slice(0, 18)])
        setHasMore(currentPage <= res.data.total_pages)
        setTimeout(() => setStatusRequest('success'), 500)
      } catch (error) {
        setStatusRequest('error')
        resetList()
      }
    }

    fetchData()
  }, [currentPage])

  useEffect(() => {
    if (isIntersecting && hasMore) {
      setCurrentPage(oldCurrentPage => oldCurrentPage + 1)
    }
  }, [isIntersecting, hasMore])

  return (
    <>
      <Head>
        <title>Netflix</title>
      </Head>

      <main className={styles.container}>
        <Header />

        {(statusRequest === 'success' || statusRequest === 'loadmore') && (
          <div className={styles.grid}>
            {mediaList.map((media, index) => <MediaCarouselCard key={`${media.id}${index}`} media={media} />)}
          </div>
        )}

        {statusRequest === 'error' && (
          <EmptyState
            title="Ops... An error occured"
            text="Something went wrong we are checking it"
          />
        )}

        {(statusRequest === 'loading' || statusRequest === 'loadmore') && (
          <div>
            <CardsSkeletonLoader />
            <CardsSkeletonLoader />
            <CardsSkeletonLoader />
            <CardsSkeletonLoader />
          </div>
        )}
      </main>

      {statusRequest === 'success' && mediaList?.length > 0 && (
        <div ref={footerRef}>
          <Footer />
        </div>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await tmdbService.getTrendings({ page: 1 })
    const results = res?.data?.results?.length
      ? res.data.results.slice(0, 18)
      : []
    const mediaFirstList = results.map((media: IMedia) => normalizeMediaPayload(media))

    return {
      props: {
        mediaFirstList
      }
    }
  } catch (error) {
    const statusCode = error?.response?.status

    if (statusCode === 404) {
      return {
        notFound: true
      }
    }

    const destination = statusCode ? `/internal-error?code=${statusCode}` : '/internal-error'

    return {
      redirect: {
        permanent: false,
        destination
      }
    }
  }
}
