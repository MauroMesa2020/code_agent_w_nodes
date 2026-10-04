
export interface Task {
    id: string;
    description: string;

    agent: string;

    status: "pending" | "running" | "completed" | "failed";

    input?: string;
    output?: string;

    dependencies?: string[];
}
