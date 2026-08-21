export interface AgentError {
    type:
        | "quota_exceeded"
        | "authentication"
        | "tool_error"
        | "invalid_response"
        | "unknown";

    message: string;

    recoverable: boolean;
}