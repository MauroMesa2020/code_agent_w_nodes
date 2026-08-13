import fs from "fs/promises";
import {resolveSafePath} from "./utils";

interface ReadArgs {
    path: string;
    startLine?: number;
    endLine?: number;
}

export async function read(
    args: ReadArgs,
    workspace: string
): Promise<string> {

    const filePath = resolveSafePath(workspace, args.path);

    const content = await fs.readFile(filePath, "utf-8");

    if (args.startLine === undefined && args.endLine === undefined) {
        return content;
    }

    const lines = content.split("\n");

    const start = Math.max((args.startLine ?? 1) - 1, 0);
    const end = Math.min(args.endLine ?? lines.length, lines.length);

    return lines.slice(start, end).join("\n");
}
