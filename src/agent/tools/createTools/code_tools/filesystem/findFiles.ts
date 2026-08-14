import fs from "fs/promises";
import path from "path";
import { resolveSafePath } from "./utils.js";

export interface FindFilesArgs {
    pattern: string;
    path?: string;
}

// findFiles({
//     pattern: "*.tsx",
//     path: "src"
// })


export async function findFiles(
    args: FindFilesArgs,
    workspace: string
): Promise<string[]> {

    const rootPath = resolveSafePath(
        workspace,
        args.path ?? "."
    );

    const results: string[] = [];

    await walk(rootPath, args.pattern, workspace, results);

    return results;
}

async function walk(
    directory: string,
    pattern: string,
    workspace: string,
    results: string[]
): Promise<void> {

    const entries = await fs.readdir(
        directory,
        { withFileTypes: true }
    );

    for (const entry of entries) {

        if (
            entry.name === "node_modules" ||
            entry.name === ".git" ||
            entry.name === ".next"
        ) {
            continue;
        }

        const fullPath = path.join(
            directory,
            entry.name
        );

        if (entry.isDirectory()) {

            await walk(
                fullPath,
                pattern,
                workspace,
                results
            );

        } else if (matchesPattern(entry.name, pattern)) {

            results.push(
                path.relative(workspace, fullPath)
            );
        }
    }
}

function matchesPattern(
    filename: string,
    pattern: string
): boolean {

    if (pattern === "*") {
        return true;
    }

    if (pattern.startsWith("*.")) {
        return filename.endsWith(
            pattern.substring(1)
        );
    }

    return filename === pattern;
}