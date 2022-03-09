import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Home() {
  const { data: session } = useSession()
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>OpenCal</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to OpenCal
          </h1>
        </main>

        <footer className="flex items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Why is it orange
          </a>
        </footer>
      </div>
    </Layout>
  )
}