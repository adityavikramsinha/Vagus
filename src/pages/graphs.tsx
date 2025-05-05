import {StrictMode} from "react";
import PathVisualiser from "@graph/components/GraphVisualiser";
import Head from "next/head";
import {JetBrains_Mono} from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains'
});

function PathsPage() {
    return <StrictMode>
        <Head>
            <link rel="icon" href="/images/icon.svg"/>
            <title>Vagus — A Path Visualiser</title>
        </Head>
        <div id="root" className={jetBrainsMono.className}>
            <PathVisualiser/>
        </div>
    </StrictMode>
}

export default PathsPage;


