import type { INode } from "./nodes/INode.js";

export class Graph<TState> {

    private nodes = new Map<string, INode<TState>>();

    private transitions = new Map<string, (state:TState) => string>();

    addNode(node: INode<TState>){
        this.nodes.set(node.id, node);
    }


    addTransition(from: string, transition: (state: TState) => string){
        this.transitions.set(from, transition);
    }
    async run(
        startNode: string,
        state: TState
    ){
        let current = startNode;

        while(true){

            const node = this.nodes.get(current);

            if(!node){
                throw new Error("Nodo no encontrado");
            }

            state = await node.execute(state);

            console.log(`El largo del state es: ${JSON.stringify(state).length}`);

            if(current === "end"){
                break;
            }

            if (current === "error"){
                break;
            }

            const transition =  this.transitions.get(current);

            if(!transition){
                throw new Error("No existe transición");
            }

            current = transition(state);

        }   
        
        return state;
    }

}