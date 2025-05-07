import useTreeStore from '../../stores/TreeStore';
import Syncer from './Syncer';
import Edge from '../../visualise-graphs/ts/Edge';
import { match } from 'ts-pattern';
import { Queue } from 'queue-typescript';

export enum AnimationType {
    VISIT_NODE = 'VISIT_NODE',
    VISIT_EDGE = 'VISIT_EDGE',
}

type VisitNodeAnimation = {
    type: AnimationType.VISIT_NODE;
    payload: string;
};
type VisitEdgeAnimation = {
    type: AnimationType.VISIT_EDGE;
    payload: Edge;
};

export type AnimationSequence = VisitNodeAnimation | VisitEdgeAnimation;

export default class Animator {
    static async animateVisitedVertices(film: Queue<AnimationSequence>) {
        for (const sequence of film) {
            await Syncer.supervise(async () => {
                match(sequence.type)
                    .with(AnimationType.VISIT_EDGE, () => {
                        const updatedVisitedEdges = new Map(useTreeStore.getState().visitedEdges);
                        const edge = sequence.payload as Edge;
                        if (!updatedVisitedEdges.has(edge.src))
                            updatedVisitedEdges.set(edge.src, new Set());
                        updatedVisitedEdges.get(edge.src)!.add(edge.dest);
                        useTreeStore.setState({ visitedEdges: updatedVisitedEdges });
                    })
                    .with(AnimationType.VISIT_NODE, () => {
                        const updatedVisitedVertices = new Set(
                            useTreeStore.getState().visitedVertices,
                        );
                        const nodeId = sequence.payload as string;
                        if (!updatedVisitedVertices.has(nodeId)) updatedVisitedVertices.add(nodeId);
                        useTreeStore.setState({ visitedVertices: updatedVisitedVertices });
                    });
                await new Promise((resolve) => setTimeout(resolve, 500));
            });
        }
    }
}
