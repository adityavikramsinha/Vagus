/**
 * Re-constructs/constructs a path, with the given start point
 * coordinates and end point coordinates along with the radius of the circle and its center.
 * @param vals contains the start coordinates (x1, y1) and end coordinates (x2, y2) in that order.
 * @param cx x-coordinate of center of the circle
 * @param cy y-coordinate of center of the circle
 * @param RADIUS
 * @param arrowLength The length of the arrowhead
 * @param arrowWidth The width of the arrowhead
 */
const constructPath = (
    vals: [number, number, number, number],
    cx: number,
    cy: number,
    RADIUS: number,
    arrowLength: number,
    arrowWidth: number
) => {
    const [centerX1, centerY1, centerX2, centerY2] = vals.map(val => val + RADIUS);

    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const dist = Math.hypot(dx, dy) || 1;

    const [shrinkX, shrinkY] = [dx, dy].map(dl => (dl / dist) * RADIUS);

    const newX1 = centerX1 + shrinkX;
    const newY1 = centerY1 + shrinkY;
    const newX2 = centerX2 - shrinkX;
    const newY2 = centerY2 - shrinkY;

    // Calculate the angle for the arrowhead
    const angle = Math.atan2(newY2 - newY1, newX2 - newX1);

    // Arrowhead base positions
    const arrowBaseX1 = newX2 - arrowLength * Math.cos(angle) + (arrowWidth / 2) * Math.sin(angle);
    const arrowBaseY1 = newY2 - arrowLength * Math.sin(angle) - (arrowWidth / 2) * Math.cos(angle);

    const arrowBaseX2 = newX2 - arrowLength * Math.cos(angle) - (arrowWidth / 2) * Math.sin(angle);
    const arrowBaseY2 = newY2 - arrowLength * Math.sin(angle) + (arrowWidth / 2) * Math.cos(angle);

    // Construct the path with the curve and arrowhead
    return `
    M ${newX1} ${newY1}
    Q ${cx} ${cy} ${newX2} ${newY2}
    M ${newX2} ${newY2}
    L ${arrowBaseX1} ${arrowBaseY1}
    M ${newX2} ${newY2}
    L ${arrowBaseX2} ${arrowBaseY2}
  `;
};

export default constructPath;
