export default class Pipe {
    public static setToMap<K,V> (set : Set<K>, v : V) {
        let map = new Map<K, V>();
        for (const key of set ) {
            map.set(key, v);
        }
        return map;
    }

    public static andInterleaveSetsToMap<K,V>(A :Set<K>,B:Set<K>, v:V){
        let map = new Map<K, V>();
        let intermediateArray = new Array<K>(A.size + B.size);
        let index = 0;
        const iteratorA = A.values();
        const iteratorB = B.values();
        let nextA = iteratorA.next();
        let nextB = iteratorB.next();

        while (!nextA.done || !nextB.done) {
            if (!nextA.done) {
                intermediateArray[index++] = nextA.value;
                nextA = iteratorA.next();
            }
            if (!nextB.done) {
                intermediateArray[index++] = nextB.value;
                nextB = iteratorB.next();
            }
        }

        for (const key of intermediateArray) {
            if (key !== undefined) { // Ensure we don't process unassigned slots if sizes differ
                map.set(key, v);
            }
        }

        return map;

    }
}