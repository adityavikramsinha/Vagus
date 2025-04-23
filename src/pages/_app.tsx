import '@graph/css/app.css';
import '@graph/css/hex.css';
import '@graph/css/button.css'
import '@graph/css/index.css';
import '@graph/css/loading.css'
import '@graph/css/dialog.css'
import '@/globals.css'
import {AppProps} from 'next/app';

function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

