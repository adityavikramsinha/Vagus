import * as m from 'motion/react';
import React from 'react';
import getPathPoints from './getPathPoints';
import deleteEdgeAndElasticConnector from './deleteEdgeAndElasticConnector';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/DialogBox';
import EdgeCostEditor from './EdgeCostEditor';
import useTreeStore from '@/stores/TreeStore';
import Button from '@/components/Button';
import { BobProps } from '@tree/components/bob/Bob';
import Toggle from '@/components/toggle/Toggle';
import { ClosedEye, OpenEye } from '@/components/toggle/VisiblityIcon';
import BackendStateManager from '@tree/api/BackendStateManager';

type ElasticConnectorProps = {
    srcBob: BobProps;
    destBob: BobProps;
    cost: number;
};

const BALL_SIZE = 20;
const RADIUS = BALL_SIZE / 2;
const ElasticConnector: React.FC<ElasticConnectorProps> = ({ srcBob, destBob, cost }) => {
    // see if the edge is in focus based on the source node id &&
    // if we are interested in finding edges.
    const inFocus = useTreeStore(
        (state) => state.srcNodeId === srcBob.id && state.activeFiles.io === 'io-2',
    );

    const isVisited = useTreeStore(
        (state) => state.visitedEdges.get(srcBob.id)?.has(destBob.id) ?? false,
    );
    // See if the edge is BiDirection for bending.
    const isBiDirectional = useTreeStore(
        (state) =>
            state.edgeList.get(srcBob.id)?.has(destBob.id) &&
            state.edgeList.get(destBob.id)?.has(srcBob.id),
    );

    const bendDirection = isBiDirectional ? (srcBob.id < destBob.id ? 1 : -1) : 0;
    const [edgeCost, setEdgeCost] = React.useState(cost);
    // Edge Visibility.
    const [edgeCostVisible, setEdgeCostVisible] = React.useState(true);
    const [singleClick, setSingleClick] = React.useState(false);
    // True Center position
    const centerX = m.useTransform<number, number>(
        [srcBob.x, destBob.x],
        ([x1v, x2v]) => (x1v + x2v) / 2 + RADIUS,
    );
    const centerY = m.useTransform<number, number>(
        [srcBob.y, destBob.y],
        ([y1v, y2v]) => (y1v + y2v) / 2 + RADIUS,
    );
    // Spring center to make the path wobble and bend + stretch appropriately.
    const springCenterX = m.useSpring(centerX, { stiffness: 1000, damping: 200 });
    const springCenterY = m.useSpring(centerY, { stiffness: 1000, damping: 200 });
    const d = m.useTransform<number, string>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y, springCenterX, springCenterY],
        ([x1v, y1v, x2v, y2v, cxv, cyv]) => {
            const { x1, y1, x2, y2, cx, cy, ax1, ay1, ax2, ay2 } = getPathPoints(
                [x1v, y1v, x2v, y2v],
                cxv,
                cyv,
                RADIUS,
                10, // arrowLength
                10, // arrowWidth
                bendDirection,
            );

            return `
                  M ${x1} ${y1}
                  Q ${cx} ${cy} ${x2} ${y2}
                  M ${x2} ${y2}
                  L ${ax1} ${ay1}
                  M ${x2} ${y2}
                  L ${ax2} ${ay2}
            `;
        },
    );

    // Computes the midpoint of a quadratic Bézier curve for tooltip positioning.
    //
    // A quadratic Bézier curve between three points (P0, P1, P2) is defined as:
    //     B(t) = (1 - t)^2 * P0 + 2 * (1 - t) * t * P1 + t^2 * P2
    //
    // To find the midpoint (at t = 0.5), the formula simplifies to:
    //     B(0.5) = 0.25 * P0 + 0.5 * P1 + 0.25 * P2
    //
    // The following useTransform hooks compute the X and Y positions of the tooltip
    // by applying this formula to the source (P0), control (P1), and destination (P2) points.
    // see and read : https://javascript.info/bezier-curve
    // Assuming bendDirection and bendAmount are normal numbers (not motion values)
    // and bendAmount = 20 for example.
    const tooltipX = m.useTransform<number, number>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y, springCenterX, springCenterY],
        ([x1, y1, x2, y2, cxv, cyv]) => {
            const {
                x1: newX1,
                x2: newX2,
                cx,
            } = getPathPoints([x1, y1, x2, y2], cxv, cyv, RADIUS, 10, 10, bendDirection);
            return 0.25 * newX1 + 0.5 * cx + 0.25 * newX2;
        },
    );
    const tooltipY = m.useTransform<number, number>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y, springCenterX, springCenterY],
        ([x1, y1, x2, y2, cxv, cyv]) => {
            const {
                y1: newY1,
                y2: newY2,
                cy,
            } = getPathPoints([x1, y1, x2, y2], cxv, cyv, RADIUS, 10, 10, bendDirection);
            return 0.25 * newY1 + 0.5 * cy + 0.25 * newY2;
        },
    );

    // Need to align the text (showing edgeCost) in the angle from src->dest
    // And we find that out via finding the tan_2 from src->dest.
    // Note, the edge actually faces FROM src -> dest, so it is written
    // Like that.
    const rotate = m.useTransform<number, number>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y],
        ([x1, y1, x2, y2]) => {
            const dx = x1 - x2;
            const dy = y1 - y2;
            const angleRad = Math.atan2(dy, dx);
            return (angleRad * 180) / Math.PI; // convert to degrees
        },
    );
    // triadic #84FFA6
    const x = m.useTransform(tooltipX, (x) => x);
    const y = m.useTransform(tooltipY, (y) => y);
    return (
        <Dialog open={singleClick} onOpenChange={(open) => !open && setSingleClick(false)}>
            <DialogTrigger asChild>
                <m.motion.g>
                    <m.motion.path
                        className="hover:cursor-pointer"
                        d={d}
                        animate={{
                            stroke: inFocus ? '#84FFA6' : '#a684ff',
                        }}
                        transition={{
                            duration: 0.4,
                            ease: 'backInOut',
                        }}
                        strokeWidth={2}
                        fill="none"
                        pointerEvents="all"
                        onClick={() => {
                            if (
                                useTreeStore.getState().activeFiles.io === 'io-2' &&
                                !useTreeStore.getState().block
                            )
                                setSingleClick(true);
                        }}
                    />
                    {isVisited && (
                        <m.motion.path
                            d={d}
                            stroke="#FFE27D"
                            strokeWidth={2.5} // slightly wider to appear on top
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            pointerEvents="none"
                        />
                    )}
                    {edgeCostVisible ? (
                        <m.motion.text
                            style={{
                                paintOrder: 'stroke',
                                stroke: 'black',
                                strokeWidth: 10,
                                x,
                                y,
                                rotate,
                                transformOrigin: 'center',
                            }}
                            className="fill-[#fff] text-xs pointer-events-none select-none bg-black"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {edgeCost}
                        </m.motion.text>
                    ) : (
                        <></>
                    )}
                </m.motion.g>
            </DialogTrigger>
            <DialogContent className="stop-dialog-content">
                <DialogHeader>
                    <DialogTitle className="text-[#fff] underline">Edge Details</DialogTitle>
                    <DialogDescription className="stop-dialog-description"></DialogDescription>
                </DialogHeader>
                <div className="text-white rounded-md py-4 shadow-md space-y-3 w-fit">
                    <div className="text-sm">
                        <span className="font-semibold text-zinc-300">Source ID:</span> {srcBob.id}
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold text-zinc-300">Destination ID:</span>{' '}
                        {destBob.id}
                    </div>
                    <div className="pt-2 border-t border-zinc-700">
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <span className="flex items-center text-sm font-semibold text-zinc-300">
                                    Edge Cost:
                                </span>
                                <EdgeCostEditor edgeCost={edgeCost} onChange={setEdgeCost} />
                            </div>
                            <Toggle pressed={edgeCostVisible} onPressedChange={setEdgeCostVisible}>
                                {edgeCostVisible ? <OpenEye /> : <ClosedEye />}
                            </Toggle>
                        </div>
                    </div>
                </div>
                <DialogFooter className="stop-dialog-footer">
                    <DialogClose asChild>
                        <Button
                            className="
                            flex items-center justify-center font-medium p-1 rounded-[5px]
                            bg-red-400 text-inherit cursor-pointer border-none transition-all
                            duration-200 hover:shadow-[0_0_0_2px_#ff6467]"
                            onClick={() => deleteEdgeAndElasticConnector(srcBob.id, destBob.id)}
                        >
                            Delete
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            className="
                            flex items-center justify-center font-medium p-1 rounded-[5px]
                            bg-green-300 text-inherit cursor-pointer border-none transition-all
                            duration-200 hover:shadow-[0_0_0_2px_#86efac]"
                            onClick={() => {
                                cost = edgeCost;
                                BackendStateManager.graph.updateEdgeCost(
                                    srcBob.id,
                                    destBob.id,
                                    cost,
                                );
                            }}
                        >
                            Done
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default React.memo(ElasticConnector);
