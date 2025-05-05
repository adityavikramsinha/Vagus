import {StrictMode} from "react";
import GraphVisualiser from "@graph/components/GraphVisualiser";
import Head from "next/head";
import {JetBrains_Mono} from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains'
});

function PathsPage() {

    const isDev = process.env.NODE_ENV === "development";
    return <StrictMode>
        <Head>
            <link rel="icon" href="/images/icon.svg"/>
            <title>Vagus — A Path Visualiser</title>
            {isDev && (
                <script
                    crossOrigin="anonymous"
                    src="//unpkg.com/react-scan/dist/auto.global.js"
                />
            )}
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <GraphVisualiser/>
        </div>
    </StrictMode>
}

export default PathsPage;


