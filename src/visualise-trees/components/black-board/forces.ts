// Function to calculate spring force
import {SpringyNode} from "../Node";

export const springForce = (dl: number, dist: number, stretch: number, k: number) => {
    return (dl / dist) * stretch * k;
};

// Function to calculate the repulsive force
export const repulsiveForce = (n1: SpringyNode, n2: SpringyNode, kRepel: number, minDist: number) => {
    const dx = n2.x.get() - n1.x.get();
    const dy = n2.y.get() - n1.y.get();
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < minDist) {
        const force = kRepel * (minDist - dist) * (minDist - dist);
        const forceX = (dx / dist) * force;
        const forceY = (dy / dist) * force;

        if (!n1.isDragging) {
            n1.vx -= forceX / n1.mass;
            n1.vy -= forceY / n1.mass;
        }

        if (!n2.isDragging) {
            n2.vx += forceX / n2.mass;
            n2.vy += forceY / n2.mass;
        }
    }
};
