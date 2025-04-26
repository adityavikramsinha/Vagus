/**
 * Re-constructs/constructs a path, with the given start point
 * coordinates and end point coordinates along with the radius of the circle and its center.
 * @param vals contains the start coordinates (x1,y1) and end coordinates (x2,y2) in that order.
 * @param cx x-coordinate of center of the circle
 * @param cy y-coordinate of center of the circle
 * @param RADIUS
 */
const constructPath = (vals : [number , number, number, number], cx: number, cy: number, RADIUS : number) =>{
    const [centerX1, centerY1, centerX2, centerY2] = vals.map(val => val + RADIUS);

    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const dist = Math.hypot(dx, dy) || 1;

    const [shrinkX, shrinkY] = [dx, dy].map(dl => (dl / dist) * RADIUS);

    const newX1 = centerX1 + shrinkX;
    const newY1 = centerY1 + shrinkY;
    const newX2 = centerX2 - shrinkX;
    const newY2 = centerY2 - shrinkY;

    return `M ${newX1} ${newY1} Q ${cx} ${cy} ${newX2} ${newY2}`;
}

export default constructPath;