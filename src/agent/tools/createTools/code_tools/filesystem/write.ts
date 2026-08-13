import fs from "fs/promises";
import path from "path";
import {resolveSafePath} from "./utils";

interface WriteArgs {
    path: string;
    content: string;
}

export async function write(
    args: WriteArgs,
    workspace: string
): Promise<void> {

    const filePath = resolveSafePath(workspace, args.path);

    await fs.mkdir(path.dirname(filePath), {
        recursive: true
    });

    await fs.writeFile(
        filePath,
        args.content,
        "utf-8"
    );
}
