export interface ToolParameter {
    type: "string" | "number" | "boolean" | "integer" | "array" | "object";
    description: string;

    enum?: string[];

    items?: ToolParameter;

    properties?: Record<string, ToolParameter>;

    required?: string[];

    default?: unknown;
}

export interface ToolSignature{
    name: string,

    description: string,

    parameters: {

        type: "object";

        properties: Record<string, ToolParameter>;

        required: string[];

    };

    version?: string;

    category?: string;

    strict?: boolean;
}

export interface Message{

    role: "system"
        | "user"
        | "assistant"
        | "tool";

    content: string;

}

export interface ToolCall{
    toolName: string;
    toolArgs: unknown;
};