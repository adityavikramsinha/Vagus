import '@graph/css/loading.css'
import '@graph/css/dialog.css'
import '@/globals.css'
import {AppProps} from 'next/app';
import Dev from "@/components/dev/Dev";


function MyApp({Component, pageProps}: AppProps) {
    return <>
        <Component {...pageProps} />
        <Dev/>
    </>;
}

export default MyApp;

