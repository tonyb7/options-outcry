import '../styles/globals.css'
import type { AppProps } from 'next/app'

import InitFirebase from '../firebase/firebase'
InitFirebase()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
