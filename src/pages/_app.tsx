import '../visualise-graphs/css/app.css';
import '../visualise-graphs/css/hex.css'
import '../visualise-graphs/css/navbar.css'
import '../visualise-graphs/css/settings.css'
import '../visualise-graphs/css/actionButtons.css'
import '../visualise-graphs/css/index.css';
import '../visualise-graphs/css/loading.css'
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

