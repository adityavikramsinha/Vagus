import React, { useEffect, useRef } from "react";
import { MotionValue } from "motion";

type ElasticBandProps = {
    start: { x: MotionValue<number>; y: MotionValue<number>};
    end: { x: MotionValue<number>; y: MotionValue<number>};
};

const BALL_SIZE = 25;
const RADIUS = BALL_SIZE / 2; // 12.5

const ElasticBand: React.FC<ElasticBandProps> = ({ start, end }) => {
    const pathRef = useRef<SVGPathElement | null>(null);

    const updatePath = () => {
        const x1 = start.x.get();
        const y1 = start.y.get();
        const x2 = end.x.get();
        const y2 = end.y.get();

        // Adjust to center of the ball
        const centerX1 = x1 + RADIUS;
        const centerY1 = y1 + RADIUS;
        const centerX2 = x2 + RADIUS;
        const centerY2 = y2 + RADIUS;

        const dx = centerX2 - centerX1;
        const dy = centerY2 - centerY1;
        const dist = Math.hypot(dx, dy) || 1;

        const shrinkX = (dx / dist) * RADIUS;
        const shrinkY = (dy / dist) * RADIUS;

        const newX1 = centerX1 + shrinkX;
        const newY1 = centerY1 + shrinkY;
        const newX2 = centerX2 - shrinkX;
        const newY2 = centerY2 - shrinkY;

        const cx = (newX1 + newX2) / 2;
        const cy = (newY1 + newY2) / 2;

        // Directly update the path
        if (pathRef.current) {
            pathRef.current.setAttribute("d", `M ${newX1} ${newY1} Q ${cx} ${cy} ${newX2} ${newY2}`);
        }
    };

    useEffect(() => {
        // Initial update
        updatePath();

        // Subscribe to motion changes
        const unsubX1 = start.x.on("change", updatePath);
        const unsubY1 = start.y.on("change", updatePath);
        const unsubX2 = end.x.on("change", updatePath);
        const unsubY2 = end.y.on("change", updatePath);

        return () => {
            unsubX1();
            unsubY1();
            unsubX2();
            unsubY2();
        };
    }, [start, end]);

    return (
        <path
            ref={pathRef}
            stroke="gray"
            strokeWidth={2}
            fill="none"
        />
    );
};

export default ElasticBand;
