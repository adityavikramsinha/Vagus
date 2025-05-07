/**
 * Re-constructs/constructs a path, with the given start point
 * coordinates and end point coordinates along with the radius of the circle and its center.
 * @param vals contains the start coordinates (x1, y1) and end coordinates (x2, y2) in that order.
 * @param cx controlX
 * @param cy controlY
 * @param bendDirection 0 if no bend, +1 or -1 if there is
 * @param bendAmount how much to bend along the normal vector?
 * @param RADIUS
 * @param arrowLength The length of the arrowhead
 * @param arrowWidth The width of the arrowhead
 */
const getPathPoints = (
    vals: [number, number, number, number],
    cx: number,
    cy: number,
    RADIUS: number,
    arrowLength: number,
    arrowWidth: number,
    bendDirection: number = 0, // -1: left, 0: straight, +1: right
    bendAmount: number = 25,
) => {
    const [centerX1, centerY1, centerX2, centerY2] = vals.map((val) => val + RADIUS);

    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const dist = Math.hypot(dx, dy) || 1;

    const [shrinkX, shrinkY] = [dx, dy].map((dl) => (dl / dist) * RADIUS);

    const newX1 = centerX1 + shrinkX;
    const newY1 = centerY1 + shrinkY;
    const newX2 = centerX2 - shrinkX;
    const newY2 = centerY2 - shrinkY;

    // Compute perpendicular offset for bending
    const normX = dx / dist;
    const normY = dy / dist;
    const perpX = -normY * bendDirection;
    const perpY = normX * bendDirection;
    if (bendDirection !== 0) {
        // Control point for quadratic curve
        const controlX = (newX1 + newX2) / 2 + perpX * bendAmount * bendDirection;
        const controlY = (newY1 + newY2) / 2 + perpY * bendAmount * bendDirection;

        // Arrowhead angle
        // Correct tangent direction (from control point to destination point)
        const tangentX = newX2 - controlX;
        const tangentY = newY2 - controlY;

        // The angle of the tangent at the destination
        const arrowAngle = Math.atan2(tangentY, tangentX);

        // Now calculate the arrowhead base positions
        const arrowBaseX1 =
            newX2 - arrowLength * Math.cos(arrowAngle) + (arrowWidth / 2) * Math.sin(arrowAngle);
        const arrowBaseY1 =
            newY2 - arrowLength * Math.sin(arrowAngle) - (arrowWidth / 2) * Math.cos(arrowAngle);

        const arrowBaseX2 =
            newX2 - arrowLength * Math.cos(arrowAngle) - (arrowWidth / 2) * Math.sin(arrowAngle);
        const arrowBaseY2 =
            newY2 - arrowLength * Math.sin(arrowAngle) + (arrowWidth / 2) * Math.cos(arrowAngle);

        return {
            x1: newX1,
            x2: newX2,
            y2: newY2,
            y1: newY1,
            ax1: arrowBaseX1,
            ay1: arrowBaseY1,
            ay2: arrowBaseY2,
            ax2: arrowBaseX2,
            cx: controlX,
            cy: controlY,
        };
    } else {
        // Calculate the angle for the arrowhead
        const angle = Math.atan2(newY2 - newY1, newX2 - newX1);

        // Arrowhead base positions
        const arrowBaseX1 =
            newX2 - arrowLength * Math.cos(angle) + (arrowWidth / 2) * Math.sin(angle);
        const arrowBaseY1 =
            newY2 - arrowLength * Math.sin(angle) - (arrowWidth / 2) * Math.cos(angle);

        const arrowBaseX2 =
            newX2 - arrowLength * Math.cos(angle) - (arrowWidth / 2) * Math.sin(angle);
        const arrowBaseY2 =
            newY2 - arrowLength * Math.sin(angle) + (arrowWidth / 2) * Math.cos(angle);

        return {
            x1: newX1,
            x2: newX2,
            y2: newY2,
            y1: newY1,
            ax1: arrowBaseX1,
            ay1: arrowBaseY1,
            ay2: arrowBaseY2,
            ax2: arrowBaseX2,
            cx: cx,
            cy: cy,
        };
    }
};
export default getPathPoints;
