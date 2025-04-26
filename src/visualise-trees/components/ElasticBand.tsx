import {motion} from "motion/react";
import React from "react";
export type ElasticBandProps = {
    start: {
        x: number,
        y: number
    };
    end: {
        x: number,
        y: number
    }
}

const ElasticBand: React.FC<ElasticBandProps> = ({start, end}) => {
    return (
        <svg className="z-[-1] absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.line
                x1={start.x + 12.5}
                y1={start.y + 12.5}
                x2={end.x + 12.5}
                y2={end.y + 12.5}
                stroke="white"
                fill="none"
                strokeWidth={2}
            />
        </svg>
    )
}

export default ElasticBand;