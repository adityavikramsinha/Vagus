import * as m from "motion/react";
import React from "react";
import reConstructPath from "./reConstructPath";
import {BobProps} from "../bob/Bob";
import handleEdgeClick from "./handleEdgeClick";
import Edge from "../../../visualise-graphs/ts/Edge";

type ElasticBandProps = {
    srcBob: BobProps,
    destBob: BobProps,
    edge : Edge
};

const BALL_SIZE = 20;
const RADIUS = BALL_SIZE / 2;
const ElasticBand: React.FC<ElasticBandProps> = ({srcBob, destBob, edge}) => {
    // True Center position
    const centerX = m.useTransform<number, number>([srcBob.x, destBob.x], ([x1v, x2v]) => (x1v + x2v) / 2 + RADIUS);
    const centerY = m.useTransform<number, number>([srcBob.y, destBob.y], ([y1v, y2v]) => (y1v + y2v) / 2 + RADIUS);
    // Spring center to make the path wobble and bend + stretch appropriately.
    const springCenterX = m.useSpring(centerX, {stiffness: 1000, damping: 200});
    const springCenterY = m.useSpring(centerY, {stiffness: 1000, damping: 200});
    const d = m.useTransform<number, string>(
        [srcBob.x, srcBob.y, destBob.x, destBob.y, springCenterX, springCenterY],
        ([x1v, y1v, x2v, y2v, cx, cy]) => reConstructPath([x1v, y1v, x2v, y2v], cx, cy, RADIUS, 15, 15)
    );

    /**
     * A Bézier curve between two points is given by the following formula :
     * B(t) = (1-t)^2. P_0  + 2(1-t).t.P_1 + t^2.T_2
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
        <m.motion.g>
            <m.motion.path
                className="hover:cursor-pointer"
                d={d}
                stroke="gray"
                strokeWidth={3}
                fill="none"
                pointerEvents="all"
                onClick={() => handleEdgeClick(srcBob.id, destBob.id)}
                onDoubleClick={() => handleEdgeClick(srcBob.id, destBob.id, true)}
            />
            <m.motion.foreignObject
                width={20}
                height={20}
                style={{
                    x: m.useTransform(tooltipX, x => x - 4.5),
                    y: m.useTransform(tooltipY, y => y - 4.5),
                    rotate: angleDeg, // Rotate the whole foreignObject
                }}
                pointerEvents="none"
            >
                <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap flex justify-center items-center">
                    {edge.cost}
                </div>
            </m.motion.foreignObject>
        </m.motion.g>
    );
};
export default ElasticBand;