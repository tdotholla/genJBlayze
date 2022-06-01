import Head from "next/head"
import * as React from "react"
import "../components/App.css"

export default function MyApp({ Component, pageProps }) {
  <Head>
    <title>JohnnyBlayzin&#39;</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </Head>
  return <Component {...pageProps} />
}
