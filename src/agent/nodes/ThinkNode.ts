import type { INode } from "./INode.js";
import type {State} from "../../shared/types/State.js";
import type { IProvider } from "../../llm/IProvider.js";
import { AgentException } from "../../exceptions/AgentExceptions.js";

//La idea es que cada nodo haga una funcion especifica, por ejemplo, la de este es llamar a un LLM.


export class ThinkNode implements INode<State> {

    readonly id = "think";

    constructor(
        private client: IProvider
    ) {}

    async execute(state: State): Promise<State> {
        try{

            const response = await this.client.invoke(state.messages);
            
            state.messages.push({

                role:"assistant",

                content:response

            });

            const parsed = JSON.parse(response);

            state.response = parsed.response;

            state.lastResponse = parsed.response;
            state.toolCall = parsed.tool_call;

            state.error = undefined;

        }catch(err){

            if (err instanceof AgentException) {

                state.error = err.agentError;

            } else {

                state.error = {
                    type: "unknown",
                    message: err instanceof Error
                        ? err.message
                        : String(err),
                    recoverable: false,
                };
            }
        }

        return state;

    }

    setClient(client: IProvider){
        this.client = client
    }
}