import { StrictMode } from 'react';
import Head from 'next/head';
import { JetBrains_Mono } from 'next/font/google';
import GraphVisualiser from '../visualise-trees/components/TreeVisualiser';

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains',
});

function GraphsPage() {
    return (
        <StrictMode>
            <Head>
                <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="./favicon.png" type="image/png" sizes="32x32" />
                <title>Vagus — A Tree Visualiser</title>
            </Head>
            <div id="root" className={jetBrainsMono.className}>
                <GraphVisualiser />
            </div>
        </StrictMode>
    );
}

export default GraphsPage;
