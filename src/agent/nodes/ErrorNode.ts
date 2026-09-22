import type { State } from "../../shared/types/State.js";
import type { INode } from "./INode.js";

export class ErrorNode implements INode<State> {

    id = "error";

    async execute(state: State): Promise<State> {

        console.error("Agent error:", state.error);

        state.finished = true;

        if (state.error?.message){
            state.response = state.error?.message;
        }else{
            state.response = "No pude completar la solicitud debido a un error";
        }


        return state;
    }
}