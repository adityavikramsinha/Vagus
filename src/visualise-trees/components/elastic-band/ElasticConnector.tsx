import * as m from "motion/react";
import React from "react";
import reConstructPath from "./reConstructPath";
import handleEdgeClick from "./handleEdgeClick";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/DialogBox";
import EdgeCostEditor from "./EdgeCostEditor";
import useTreeStore from "@/stores/TreeStore";
import Button from "@graph/components/action-buttons/Button";
import Edge from "@graph/ts/Edge";
import {BobProps} from "@tree/components/bob/Bob";

type ElasticConnectorProps = {
    srcBob: BobProps,
    destBob: BobProps,
    edge: Edge
};

const BALL_SIZE = 20;
const RADIUS = BALL_SIZE / 2;
const ElasticConnector: React.FC<ElasticConnectorProps> = ({srcBob, destBob, edge}) => {
    const [edgeCost, setEdgeCost] = React.useState(edge.cost);
    const [singleClick, setSingleClick] = React.useState(false);
    // True Center position
    const centerX = m.useTransform<number, number>([srcBob.x, destBob.x], ([x1v, x2v]) => (x1v + x2v) / 2 + RADIUS);
    const centerY = m.useTransform<number, number>([srcBob.y, destBob.y], ([y1v, y2v]) => (y1v + y2v) / 2 + RADIUS);
    // Spring center to make the path wobble and bend + stretch appropriately.
    const springCenterX = m.useSpring(centerX, {stiffness: 1000, damping: 200});
    const springCenterY = m.useSpring(centerY, {stiffness: 1000, damping: 200});
    const d = m.useTransform<number, string>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y, springCenterX, springCenterY],
        ([x1v, y1v, x2v, y2v, cx, cy]) => reConstructPath([x1v, y1v, x2v, y2v], cx, cy, RADIUS, 10, 10)
    );

    /**
     * A Bézier curve between two points is given by the following formula :
     * B(t) = (1-t)^2. P_0  + 2(1-t).t.P_1 + t^2.P_2
     * We find the midpoint by putting parameter t = 0.5,
     * The below two functions for the tooltip[x,y] use this formula and transform IRL.
     */
    const tooltipX = m.useTransform<number, number>(
        [srcBob.x, springCenterX, destBob.x],
        ([x1, cx, x2]) => (0.25 * x1 + 0.5 * cx + 0.25 * x2)
    );
    const tooltipY = m.useTransform<number, number>(
        [srcBob.y, springCenterY, destBob.y],
        ([y1, cy, y2]) => (0.25 * y1 + 0.5 * cy + 0.25 * y2)
    );

    /**
     * Need to align the text (showing edgeCost) in the angle from src->dest
     * And we find that out via finding the tan_2 from src->dest.
     * Note, the edge actually faces FROM src -> dest, so it is written
     * Like that.
     */
    const angleDeg = m.useTransform<number, number>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y],
        ([x1, y1, x2, y2]) => {
            const dx = x1 - x2;
            const dy = y1 - y2;
            const angleRad = Math.atan2(dy, dx);
            return (angleRad * 180) / Math.PI; // convert to degrees
        }
    );
    return (
        <Dialog open={singleClick} onOpenChange={(open) => !open && setSingleClick(false)}>
            <DialogTrigger asChild>
                <m.motion.g>
                    <m.motion.path
                        className="hover:cursor-pointer"
                        d={d}
                        stroke="#a684ff"
                        strokeWidth={2}
                        fill="none"
                        pointerEvents="all"
                        onClick={() => {
                            if (useTreeStore.getState().activeFiles.io === 'io-2')
                                setSingleClick(true)
                        }}
                        onContextMenu={(e) => {
                            if (useTreeStore.getState().activeFiles.io === 'io-2') {
                                e.preventDefault();
                                handleEdgeClick(srcBob.id, destBob.id)
                            }
                        }}
                    />
                    <m.motion.text
                        style={{
                            paintOrder: "stroke",
                            stroke: "black",
                            strokeWidth: 10,
                            x: m.useTransform(tooltipX, (x) => x + 4.5),
                            y: m.useTransform(tooltipY, (y) => y + 5),
                            rotate: angleDeg,
                            transformOrigin: "center",
                        }}
                        className="fill-[#fff] text-xs pointer-events-none select-none bg-black"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {edgeCost}
                    </m.motion.text>
                </m.motion.g>
            </DialogTrigger>
            <DialogContent className="stop-dialog-content">
                <DialogHeader className="stop-dialog-header">
                    <DialogTitle className="text-[#fff] underline">Edge Details</DialogTitle>
                    <DialogDescription className="stop-dialog-description">
                        <div className="text-white rounded-md py-4 shadow-md space-y-3 w-fit">
                            <div className="text-sm">
                                <span className="font-semibold text-zinc-300">Source ID:</span> {srcBob.id}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold text-zinc-300">Destination ID:</span> {destBob.id}
                            </div>
                            <div className="pt-2 border-t border-zinc-700">
                                <div className="flex">
                                    <div className="flex items-center text-sm font-semibold text-zinc-300">Edge Cost:
                                    </div>
                                    <EdgeCostEditor edgeCost={edgeCost} onChange={setEdgeCost}/>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="stop-dialog-footer">
                    <DialogClose asChild>
                        <Button className="stop-dialog-cancel-button" onClick={() => {
                            edge.cost = edgeCost;
                        }}>
                            Update
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default ElasticConnector;
