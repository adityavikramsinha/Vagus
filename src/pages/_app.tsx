import '@graph/css/loading.css'
import '@graph/css/dialog.css'
import '@/globals.css'
import {AppProps} from 'next/app';
import Dev from "@/components/dev/Dev";


function MyApp({Component, pageProps}: AppProps) {
    const isDev = process.env.NODE_ENV === "development";
    return <>
        <Component {...pageProps} />
        <Dev/>
    </>;
}

export default MyApp;

