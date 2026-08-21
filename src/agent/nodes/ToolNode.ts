import type { INode } from "./INode.js";
import type { State } from "../../shared/types/State.js";
import type {ITool} from "../tools/ITool.js";
//La idea es que cada nodo haga una funcion especifica, por ejemplo, la de este es ejecutar la tool pedida.
export class ToolNode implements INode<State> {

    readonly id = "tools";

    constructor(
        private tools: Map<string, ITool>
    ) {}

    async execute(state: State): Promise<State> {

        if (!state.toolCall?.toolName) {
            return state;
        }

        const tool = this.tools.get(state.toolCall.toolName);

        if (!tool) {
            throw new Error(`Tool '${state.toolCall.toolName}' no encontrada.`);
        }

        const result = await tool.run(state.toolCall.toolArgs);

        state.toolResult = result;
        state.toolCall = undefined;

        state.messages.push({

            role:"tool",

            content:JSON.stringify(result)

        });

        return state;
    }
    
}