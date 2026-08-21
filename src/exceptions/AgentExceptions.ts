import type { AgentError } from "../shared/types/AgentError.js";

export class AgentException extends Error {

    constructor(
        public readonly agentError: AgentError
    ) {
        super(agentError.message);
        this.name = "AgentException";
    }
}