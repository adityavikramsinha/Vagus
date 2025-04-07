import { StrictMode } from "react";
import GraphVisualiserApp from "../visualiseGraphs/components/GraphVisualiserApp";
import  Head  from "next/head";

function GraphsPage() {
    return <StrictMode>
        <Head>
            <link rel="icon" href="/favicon.png" />
            <title>Vagus — A Path Visualiser</title>
        </Head>
        <div id = "root">
            <GraphVisualiserApp/>
        </div>
    </StrictMode>
}

export default GraphsPage;


