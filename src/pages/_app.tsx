import '@component/styles/globals.scss'
import type {AppProps} from 'next/app'
import {Footer} from "@component/components/Footer";
import '../styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Banner} from "@component/components/Banner";
import NavBar from "@component/components/NavBar";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <NavBar/>
            <Banner/>

            <Component {...pageProps} />
            <Footer/>
        </>
    )
}
