import type { State } from "../../shared/types/State.js";
import type { INode } from "./INode.js";

export class EndNode implements INode<State> {

    readonly id = "end";

    async execute(state: State): Promise<State> {

        state.finished = true;

        return state;
    }
}