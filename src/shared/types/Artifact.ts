export interface Artifact {
    id: string;

    type:
        | "architecture"
        | "api-contract"
        | "db-schema"
        | "source-code"
        | "test"
        | "review";

    path: string;

    createdBy: string;

    version: number;
}