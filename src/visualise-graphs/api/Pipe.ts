export default class Pipe {
    public static setToMap<K,V> (set : Set<K>, v : V) {
        let map = new Map<K, V>();
        for (const key of set ) {
            map.set(key, v);
        }
        return map;
    }

    public static setsToMap<K,V>( sets : Set <K>[], v :V) {
        let map = new Map<K, V>();
        for (const set of sets){
            for (const key of set) {
                map.set(key, v);
            }
        }
        return map;
    }
}