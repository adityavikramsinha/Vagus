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
            <link rel="icon" href="/favicon.png"/>
            <title>Vagus — A Path Visualiser</title>
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <GraphVisualiser/>
        </div>
    </StrictMode>
}

export default GraphsPage;


