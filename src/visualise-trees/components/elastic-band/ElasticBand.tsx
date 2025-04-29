import * as m from "motion/react";
import React from "react";
import reConstructPath from "./reConstructPath";
import {BobProps} from "../bob/Bob";

type ElasticBandProps = {
    srcBob: BobProps,
    destBob: BobProps
};

const BALL_SIZE = 20;
const RADIUS = BALL_SIZE / 2;

const ElasticBand: React.FC<ElasticBandProps> = ({srcBob, destBob}) => {


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

    const ARROW_LENGTH = 15;
    const ARROW_WIDTH = 15;
    return (
        <g>
            <m.motion.path
                className="hover:cursor-pointer"
                d={d}
                stroke="gray"
                strokeWidth={3}
                fill="none"
                pointerEvents="all"
                onClick={() => alert("Edge clicked")}
            />
        </g>
    );

};

export default ElasticBand;
