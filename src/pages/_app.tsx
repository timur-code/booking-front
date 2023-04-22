import '@component/styles/globals.scss'
import type {AppProps} from 'next/app'
import ReNavBar from "@component/components/navbar";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <ReNavBar/>
            <Component {...pageProps} />
        </>
    )
}
