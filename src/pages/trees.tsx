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
    return <StrictMode>
        <Head>
            <link rel="icon" href="/images/favicon.svg"/>
            <title>Vagus — A Tree Visualiser</title>
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <TreeVisualiserApp/>
        </div>
    </StrictMode>
}

export default GraphsPage;