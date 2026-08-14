import fs from "fs/promises";
import { resolveSafePath } from "./utils";

export interface MkdirArgs {
    path: string;
}

export async function mkdir(
    args: MkdirArgs,
    workspace: string
): Promise<void> {

    const directoryPath = resolveSafePath(
        workspace,
        args.path
    );

    await fs.mkdir(directoryPath, {
        recursive: true
    });
}