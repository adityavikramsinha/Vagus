import '../css/app.css';
import '../css/hex.css'
import '../css/navbar.css'
import '../css/settings.css'
import '../css/actionButtons.css'
import App from "../components/App";
import '../css/index.css';
import {StrictMode} from 'react';
import Head from "next/head";

function WrapperApp() {
  return <StrictMode>
    <Head>
      <link rel="icon" href="/favicon.png" />
      <title>Vagus — A Path Visualiser</title>
    </Head>
    <div id = "root">
    <App />
    </div>
  </StrictMode>
}

export default WrapperApp;
