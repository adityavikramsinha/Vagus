import {StrictMode} from "react";
import GraphVisualiser from "@graph/components/GraphVisualiser";
import Head from "next/head";
import {JetBrains_Mono} from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains'
});

function GraphsPage() {
    return <StrictMode>
        <Head>
            <link rel="shortcut icon" href="/images/favicon.svg" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.svg" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.svg"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.svg"/>
            <title>Vagus — A Path Visualiser</title>
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <GraphVisualiser/>
        </div>
    </StrictMode>
}

export default GraphsPage;


