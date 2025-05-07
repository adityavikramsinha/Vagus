import { Particle } from '../bob/Bob';

/**
 * Applies basic Coulomb Force at "short ranges" on 2 Particles for a time-step dt = 1.
 * @param p1 first particle
 * @param p2 second particle
 * @param c Coulombs Constant.
 * @param shortRange the range for which the force should be active.
 */
export const repulsive = (p1: Particle, p2: Particle, c: number, shortRange: number) => {
    if (!p1 || !p2) return;
    const dx = p2.x.get() - p1.x.get();
    const dy = p2.y.get() - p1.y.get();
    const dist = Math.hypot(dx, dy) || 1;
    if (dist < shortRange) {
        const force = c * Math.pow(shortRange - dist, 2);
        const [Fx, Fy] = [dx, dy].map((dl) => (dl / dist) * force);
        [p1, p2].forEach((p, i) => {
            if (!p.isDragging) {
                const sign = i === 0 ? -1 : 1;
                p.vx += (sign * Fx) / p.mass;
                p.vy += (sign * Fy) / p.mass;
            }
        });
    }
};

/**
 * Applies a linear spring force WITHOUT any damping, so it is a pure
 * 2nd-degree linear differential equation
 * @param p1 Particle
 * @param p2 Particle
 * @param k stiffness
 * @param restLength relaxed length
 */
export const springForce = (p1: Particle, p2: Particle, k: number, restLength: number) => {
    if (!p1 || !p2) return;
    const dx = p2.x.get() - p1.x.get();
    const dy = p2.y.get() - p1.y.get();
    const dist = Math.max(0.1, Math.hypot(dx, dy));
    const stretch = dist - restLength;
    const [Fx, Fy] = [dx, dy].map((dl) => (dl / dist) * stretch * k);
    [p1, p2].forEach((p, i) => {
        if (!p.isDragging) {
            const sign = i === 0 ? 1 : -1;
            p.vx += (sign * Fx) / p.mass;
            p.vy += (sign * Fy) / p.mass;
        }
    });
};

/**
 * Applies a damping force which is proportional to velocity of the particle and
 * "scales it", so for a damping the prop constant <1 orelse it won"t converge
 * @param p the particle
 * @param b the prop constant.
 */
export const damping = (p: Particle, b: number) => {
    [p.vx, p.vy] = [p.vx, p.vy].map((vl) => vl * b);
    p.x.set(p.x.get() + p.vx);
    p.y.set(p.y.get() + p.vy);
};
