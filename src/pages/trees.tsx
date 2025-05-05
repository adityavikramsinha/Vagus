import {StrictMode} from "react";
import Head from "next/head";
import {JetBrains_Mono} from "next/font/google";
import TreeVisualiserApp from "../visualise-trees/components/TreeVisualiser";

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains'
});

function GraphsPage() {

    const isDev = process.env.NODE_ENV === "development";
    return <StrictMode>
        <Head>
            <link rel="icon" href="/images/icon.svg"/>
            <title>Vagus — A Tree Visualiser</title>
            {isDev && (
                <script
                    crossOrigin="anonymous"
                    src="//unpkg.com/react-scan/dist/auto.global.js"
                />
            )}
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <TreeVisualiserApp/>
        </div>
    </StrictMode>
}

export default GraphsPage;
