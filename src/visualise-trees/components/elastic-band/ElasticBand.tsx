import * as m from "motion/react";
import React from "react";
import reConstructPath from "./reConstructPath";

type ElasticBandProps = {
    x1: m.MotionValue<number>,
    x2: m.MotionValue<number>,
    y1: m.MotionValue<number>,
    y2: m.MotionValue<number>,
};

const BALL_SIZE = 25;
const RADIUS = BALL_SIZE / 2;

const ElasticBand: React.FC<ElasticBandProps> = ({x1, x2, y1, y2}) => {

    // True Center position
    const centerX = m.useTransform([x1, x2], ([x1v, x2v]: [number, number]) => (x1v + x2v) / 2 + RADIUS);
    const centerY = m.useTransform([y1, y2], ([y1v, y2v]: [number, number]) => (y1v + y2v) / 2 + RADIUS);

    // Spring center to make the path wobble and bend + stretch appropriately.
    const springCenterX = m.useSpring(centerX, {stiffness: 1000, damping: 200});
    const springCenterY = m.useSpring(centerY, {stiffness: 1000, damping: 200});

    const d = m.useTransform(
        [x1, y1, x2, y2, springCenterX, springCenterY],
        ([x1v, y1v, x2v, y2v, cx, cy]:
         [number, number, number, number, number, number]) =>
            reConstructPath([x1v, y1v, x2v, y2v], cx, cy, RADIUS)
    );

    return (
        <m.motion.path d={d} stroke="gray" strokeWidth={2} fill="none"/>
    );
};

export default ElasticBand;
