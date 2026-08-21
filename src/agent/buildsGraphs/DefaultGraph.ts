import type { IProvider } from "../../llm/IProvider.js";
import { EndNode } from "../nodes/EndNode.js";
import { ThinkNode } from "../nodes/ThinkNode.js";
import { ToolNode } from "../nodes/ToolNode.js";
import type { ITool } from "../tools/ITool.js";
import { Graph } from "../Graph.js";
import type { State } from "../../shared/types/State.js";
import { ErrorNode } from "../nodes/ErrorNode.js";


export function DefaultGraph(

    client: IProvider,

    tool: Map<string, ITool>,
    

): Graph<State>{

    const graph = new Graph<State>();

    graph.addNode(
        new ThinkNode(client)
    );

    graph.addNode(
        new ToolNode(tool)
    );

    graph.addNode(
        new EndNode()
    );

    graph.addNode(
        new ErrorNode()
    );

    graph.addTransition(
        "think",
        (state) => {
            console.log("Evaluando transición de think");

            if (state.error) {

                if (state.error.recoverable) {
                    return "think";
                }
                
                return "error";
            }

            if (state.toolCall) {
                return "tools";
            }

            return "end";
        }
    );

    graph.addTransition(
        "tools",
        () => "think"
    );

    // console.log("Transiciones al construir:", (graph as any).transitions);
    return graph;

}