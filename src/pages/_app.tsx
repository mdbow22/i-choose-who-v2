import '@/styles/globals.css'
import { APIProvider } from '@/utils/api'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps: {
  session, ...pageProps
} }: AppProps) {
  return (
    <SessionProvider session={session} >
      <APIProvider>
        <Component {...pageProps} />
      </APIProvider>
    </SessionProvider>
  )
}
