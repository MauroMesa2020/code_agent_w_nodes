import fs from "fs/promises";
import path from "path";
import { resolveSafePath } from "./utils.js";

export interface TreeArgs {
    path?: string;
    depth?: number;
}

// Mejorar esos ! puestos temporalmente

export async function tree(
    args: TreeArgs,
    workspace: string
): Promise<string> {

    const root = args.path ?? ".";
    const maxDepth = args.depth ?? 3;

    const rootPath = resolveSafePath(
        workspace,
        root
    );

    const lines: string[] = [
        `${path.basename(rootPath)}/`
    ];

    await buildTree(
        rootPath,
        "",
        0,
        maxDepth,
        lines
    );

    return lines.join("\n");
}

async function buildTree(
    directory: string,
    prefix: string,
    depth: number,
    maxDepth: number,
    lines: string[]
): Promise<void> {

    if (depth >= maxDepth) {
        return;
    }

    const entries = await fs.readdir(
        directory,
        { withFileTypes: true }
    );

    const filtered = entries.filter(entry =>
        entry.name !== "node_modules" &&
        entry.name !== ".git" &&
        entry.name !== ".next"
    );

    for (let i = 0; i < filtered.length; i++) {

        const entry = filtered[i];

        const isLast = i === filtered.length - 1;

        const connector = isLast
            ? "└── "
            : "├── ";

        lines.push(
            `${prefix}${connector}${entry!.name}${entry!.isDirectory() ? "/" : ""}`
        );

        if (entry!.isDirectory()) {

            await buildTree(
                path.join(directory, entry!.name),
                prefix + (isLast ? "    " : "│   "),
                depth + 1,
                maxDepth,
                lines
            );
        }
    }
}