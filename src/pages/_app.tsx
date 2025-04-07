import '../visualiseGraphs/css/app.css';
import '../visualiseGraphs/css/hex.css'
import '../visualiseGraphs/css/navbar.css'
import '../visualiseGraphs/css/settings.css'
import '../visualiseGraphs/css/actionButtons.css'
import '../visualiseGraphs/css/index.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

