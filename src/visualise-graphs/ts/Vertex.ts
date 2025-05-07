import Edge from './Edge';

/**
 * This is the vertex class of this project.
 * This is also the most important class in this project.
 * The main reason why this is so important is that it is the smallest
 * UNIT present in this project and refers to a single entity which can
 * be manipulated.
 *
 * If a logical schema for this class was drawn, then it would look something
 * like this
 *           neighbour <- |===| -> neighbour
 *
 * This class can also deal with any type of "vertex", in our project it is
 * a number.
 *
 * @author aditya, <adityavikramsinha19@gmail.com>
 */
export default class Vertex {

    //id or the UID of a vertex
    private readonly data: string;

    // List of neighbours [refer to logical diagram] in the form of
    // src -> cost -> dest where cost is the cost of moving from THIS vertex to
    // its neighbour vertex.
    adjVertices: Map<string, Edge>;

    // Placement on the hex board, x coordinate system.
    private xCoord: number = 0;

    // Placement on the hex board, y coordinate system.
    private yCoord: number = 0;

    /**
     * Function takes in both a string and a number.
     * In case it is a number, it will directly assign the coordinate
     * In case it is a string, it attempts to parse it.
     * After parsing it and converting it to a number, it will update value
     *
     * If it cannot parse it, then it will lead to an error which means no update will take place
     * Hence the coordinate will remain 0[default value] or the previous current input remains.
     *
     * @param x x coordinate of the vertex on the hex board
     */
    setX(x: number | string): void {
        if (typeof x === "string") this.xCoord = parseFloat(x);
        else this.xCoord = x;
    }

    /**
     * Function takes in either a string or a number.
     * In case it is a number, the function directly assigns the y coordinate
     * In case the input is a string, the function attempts to parse it.
     *
     * If the parsing works, then it will update the value.
     * If the parsing fails, the y coordinate is not updated and remains at
     * 0[unless previously a correct input was given]
     *
     *
     * @param y y coordinate of the vertex on the hex board
     */
    setY(y: number | string): void {
        if (typeof y === "string") this.yCoord = parseFloat(y);
        else this.yCoord = y;
    }

    /**
     * Function takes in either string or number.
     * Upon getting the inputs, it will pass them on to the individual
     * setX and setY functions.
     * Over there, attempts are either made to parse a string input or
     * to assign the number input.
     *
     * Upon success both are updated
     * If either one fails then the other one is updated while the failed one
     * remains unchanged.
     * If both fail then both remain unchanged.
     *
     * Default value again is 0 to begin with.
     *
     * @param x x coordinate of this vertex
     * @param y y coordinate of this vertex
     */
    setCoords(x: number, y: number): void {
        this.setX(x);
        this.setY(y);
    }

    /**
     *
     * @returns The x coordinate of this vertex.
     */
    x(): number {
        return this.xCoord;
    }

    /**
     *
     * @returns The y coordinate of this vertex
     */
    y(): number {
        return this.yCoord;
    }

    /**
     *
     * @returns An object that has the x and y coordinates of
     * this vertex.
     */
    coordinates(): { x: number, y: number } {
        return {x: this.xCoord, y: this.yCoord};
    }

    // comparator for total ordering in the vertex class
    // In this project it is being used in the Priority Queue implementations
    // of the Algorithms.
    comparator: (a: string, b: string) => number;

    /**
     * Constructs a given vertex with the values as given to the constructor.
     * By default,
     * The vertex has its data as nothing
     * The vertex has no comparator
     * The vertex has itself as a neighbour
     * The vertex has 0 , 0 as its x and y coordinates
     *
     * @param data the id of the vertex a data which needs to be wrapped by the vertex class
     * @param comparator comparator for total ordering and other le,ge,eq operations
     * @param x x coordinate of the vertex
     * @param y y coordinate of the vertex
     */
    constructor(data: string, comparator: (a: string, b: string) => number, x: number = 0, y: number = 0) {
        this.data = data;
        this.comparator = comparator;
        this.adjVertices = new Map();
        this.adjVertices.set(data, new Edge(data, data, 0));
        this.setX(x);
        this.setY(y);
    }

    /**
     *
     * @returns The data wrapped around by the vertex
     */
    getData(): string {
        return this.data;
    }

    /**
     *
     * @returns
     * A set of edges which contain the neighbouring vertices of this vertex.
     */
    getAdjVertices() {
        return this.adjVertices;
    }

    /**
     * Adds a given vertex as a neighbour OR "adjacent vertex" to this vertex
     * provided that, there is no other adjacent neighbour with the same ID.
     * Also, this connection is an outgoing connection.
     *
     * @param v The vertex to add
     * @param cost The cost of travelling form this not to the vertex to be added
     * @returns nothing
     */
    addAdjVertex(v: Vertex, cost: number): void {
        // ensure no edge has the same data as the current one
        if (!this.adjVertices.has(v.getData()))
            this.adjVertices.set(v.getData(), new Edge(this.data, v.getData(), cost));
    }

    /**
     * Updates the cost of movement from this v to a neighbour which is
     * present in the adjacent list array.
     *
     * @param v the v for which the cost needs to be updated
     * @param cost the new cost.
     * @returns true if it was successfully updated, else false.
     */
    updateCostTo(v: Vertex, cost: number): boolean {
        // first get the v to update.
        let edgeToUpdate = this.adjVertices.get(v.getData());

        // if it is undefined, then the given v does not exist
        // thus, we return false
        if (edgeToUpdate === undefined) return false;

        // else just update
        edgeToUpdate.cost = cost;

        // return true.
        return true;
    }

    /**
     * Removes a vertex from the given list of neighbours.
     * If, it does not exist then null is returned.
     * If it does, then it is removed.
     * @param data the data of the vertex to be removed
     * @returns true if a vertex was deleted or else false (in case it does not exist)
     *
     */
    rmAdjVertex(data: string) {
        return this.adjVertices.delete(data);
    }

    /**
     * An example of the meta-data returned from this function is:
     * data: <data> ,
     * Neighbours : [
     *    {data:<data>, cost:<cost>},
     *    {data:<data>, cost:<cost>}
     *    ...
     * ]
     * coords: {
     *    x:<x-coordinate>,
     *    y:<y-coordinate>
     * }
     * @returns the string representation of the given vertex
     */
    toString(): string {
        let metaData: string = 'data:' + this.data + ',\nNeighbours:[\n';
        this.adjVertices.forEach(edge => {
            metaData += "    {dest:" + edge.dest + ", cost:" + edge.cost + "},\n";
        });
        metaData += "]\ncoords:{";
        metaData += "\n     x:" + this.xCoord;
        metaData += "\n     y:" + this.yCoord;
        metaData += "\n}";
        return metaData;
    }

    /**
     * Function returns a pseudo-random neighbour.
     * Function does not return a vertex as a neighbour.
     *
     * @returns A random neighbour from the list of neighbours
     */
    getRandomNeighbour(): string{
        while (true) {
            let neighbourId = Array.from(this.getAdjVertices().values())[Math.floor(Math.random() * this.getAdjVertices().size)].dest;
            if (neighbourId !== this.data || this.adjVertices.size === 1)
                return neighbourId;
        }
    }
}
