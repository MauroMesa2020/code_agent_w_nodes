import type { Artifact } from "./Artifact.js";

export interface ToolResult {
    result?: unknown;

    artifacts?: Artifact[];
}