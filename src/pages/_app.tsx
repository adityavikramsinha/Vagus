import '../css/app.css';
import '../css/hex.css'
import '../css/navbar.css'
import '../css/settings.css'
import '../css/actionButtons.css'
import App from "../ts/App";
import '../css/index.css';
import {StrictMode} from 'react';

function WrapperApp() {
  return <StrictMode>
    <div id = "root">
    <App />
    </div>
  </StrictMode>
}

export default WrapperApp;
