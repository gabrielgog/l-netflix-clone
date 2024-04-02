import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Button } from '../../components/Button'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import styles from './styles.module.scss'

interface IPageInternalErrorProps {
  statusCode?: string
}

export default function PagePageInternalError ({ statusCode }: IPageInternalErrorProps) {
  return (
    <>
      <Head>
        <title>Netflix</title>
      </Head>

      <main>
        <Header />

        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>
              {statusCode ? `Erro ${statusCode}` : 'Ocorreu um erro'}
            </h1>
            <p className={styles.bannerText}>
              Ops... An error occured<br />
              We are checking it
            </p>

            <Link href="/" passHref>
              <Button>Go back home</Button>
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      statusCode: query?.code || null
    }
  }
}
