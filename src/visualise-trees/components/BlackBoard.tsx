import React, { useRef, useState } from "react";
import Node from "./Node";
import ElasticBand from "./ElasticBand";

export const Blackboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState([
        { x: 100, y: 100 },
        { x: 300, y: 300 },
        { x: 400, y: 300 },
    ]);

    const updatePosition = (index: number, x: number, y: number) => {
        setPositions((prev) => {
            const next = [...prev];
            next[index] = { x, y };
            return next;
        });
    };

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black text-white overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <ElasticBand start={positions[0]} end={positions[1]} />
                <ElasticBand start={positions[1]} end={positions[2]} />
                <ElasticBand start={positions[0]} end={positions[2]} />

            </svg>

            {positions.map((pos, i) => (
                <Node
                    key={i}
                    index={i}
                    position={pos}
                    onUpdate={updatePosition}
                />
            ))}
        </div>
    );
};
export default Blackboard;