import '@graph/css/loading.css'
import '@graph/css/dialog.css'
import '@/globals.css'
import {AppProps} from 'next/app';
import Script from "next/script";


function MyApp({Component, pageProps}: AppProps) {
    const isDev = process.env.NODE_ENV === "development";
    return <>
        <Component {...pageProps} />
        {isDev && <Script src="https://unpkg.com/react-scan/dist/auto.global.js"/>}
    </>;
}

export default MyApp;

