//La haría buscar dentro de archivos y devolver archivo + línea + contenido.

// Mejorar el ! puesto provicional en la fila: 96

import fs from "fs/promises";
import path from "path";
import { resolveSafePath } from "./utils.js";

export interface SearchArgs {
    query: string;
    path?: string;
    context?: number;
}

export interface SearchResult {
    file: string;
    line: number;
    content: string;
}

export async function search(
    args: SearchArgs,
    workspace: string
): Promise<SearchResult[]> {

    const rootPath = resolveSafePath(
        workspace,
        args.path ?? "."
    );

    const results: SearchResult[] = [];

    await searchDirectory(
        rootPath,
        args.query,
        args.context ?? 0,
        workspace,
        results
    );

    return results;
}

async function searchDirectory(
    directory: string,
    query: string,
    context: number,
    workspace: string,
    results: SearchResult[]
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

            await searchDirectory(
                fullPath,
                query,
                context,
                workspace,
                results
            );

            continue;
        }

        try {

            const content = await fs.readFile(
                fullPath,
                "utf-8"
            );

            const lines = content.split("\n");

            for (let i = 0; i < lines.length; i++) {

                if (!lines[i]!.includes(query)) {
                    continue;
                }

                const start = Math.max(
                    0,
                    i - context
                );

                const end = Math.min(
                    lines.length,
                    i + context + 1
                );

                results.push({
                    file: path.relative(
                        workspace,
                        fullPath
                    ),
                    line: i + 1,
                    content: lines
                        .slice(start, end)
                        .join("\n")
                });
            }

        } catch {
            // Ignorar archivos que no puedan leerse como texto.
        }
    }
}