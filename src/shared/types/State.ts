import type {Message, ToolCall} from "../utils/utils_tool.js";
import type { AgentError } from "./AgentError.js";
import type { Artifact } from "./Artifact.js";

export interface State {

    messages: Message[];

    lastResponse?: string;
    
    toolCall?: ToolCall | undefined;

    finished: boolean;

    toolResult?: unknown;

    response?: string;

    error?: AgentError | undefined;

    artifacts?: Artifact[];

}