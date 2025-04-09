import { StrictMode } from "react";
import GraphVisualiser from "../visualise-graphs/components/GraphVisualiser";
import  Head  from "next/head";

function GraphsPage() {
    return <StrictMode>
        <Head>
            <link rel="icon" href="/favicon.png" />
            <title>Vagus — A Path Visualiser</title>
        </Head>
        <div id = "root">
            <GraphVisualiser/>
        </div>
    </StrictMode>
}

export default GraphsPage;


