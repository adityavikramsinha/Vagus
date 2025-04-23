import '@graph/css/loading.css'
import '@graph/css/dialog.css'
import '@/globals.css'
import {AppProps} from 'next/app';

function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

