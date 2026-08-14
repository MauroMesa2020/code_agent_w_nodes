import fs from "fs/promises";
import { resolveSafePath } from "./utils.js";

export interface ListDirectoryArgs {
    path?: string;
}

export interface DirectoryEntry {
    name: string;
    type: "file" | "directory";
}

export async function listDirectory(
    args: ListDirectoryArgs,
    workspace: string
): Promise<DirectoryEntry[]> {

    const directoryPath = resolveSafePath(
        workspace,
        args.path ?? "."
    );

    const entries = await fs.readdir(
        directoryPath,
        { withFileTypes: true }
    );

    return entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory()
            ? "directory"
            : "file"
    }));
}