import {Particle} from "../bob/Bob";

/**
 * Applies basic Coulomb Force at "short ranges" on 2 Particles for a time-step dt = 1.
 * @param p1 first particle
 * @param p2 second particle
 * @param c Coulombs Constant.
 * @param shortRange the range for which the force should be active.
 */
export const repulsive = (
    p1: Particle,
    p2: Particle,
    c: number,
    shortRange: number) => {
    if (!p1 || !p2) return;
    const dx = p2.x.get() - p1.x.get();
    const dy = p2.y.get() - p1.y.get();
    const dist = Math.hypot(dx, dy) || 1;
    if (dist < shortRange) {
        const force = c * Math.pow((shortRange - dist), 2);
        const [Fx, Fy] = [dx, dy].map(dl => (dl / dist) * force);
        [p1, p2].forEach((p, i) => {
            if (!p.isDragging) {
                const sign = i === 0 ? -1 : 1;
                p.vx += sign * Fx / p.mass;
                p.vy += sign * Fy / p.mass;
            }
        });
    }
};


export const springForce = (
    p1: Particle,
    p2: Particle,
    stiffness: number,
    restLength: number
) => {
    if (!p1 || !p2) return;
    const dx = p2.x.get() - p1.x.get();
    const dy = p2.y.get() - p1.y.get();
    const dist = Math.max(0.1, Math.hypot(dx, dy));
    const stretch = dist - restLength;
    const [Fx, Fy] = [dx, dy].map(dl => (dl / dist) * stretch * stiffness);
    [p1, p2].forEach((p, i) => {
        if (!p.isDragging) {
            const sign = i === 0 ? 1 : -1;
            p.vx += sign * Fx / p.mass;
            p.vy += sign * Fy / p.mass;
        }
    })
}