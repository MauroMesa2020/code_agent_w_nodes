import fs from "fs/promises";
import { resolveSafePath } from "./utils";

interface DeleteArgs {
    path: string;
}

export async function deleteFile(
    args: DeleteArgs,
    workspace: string
): Promise<void> {

    const filePath = resolveSafePath(
        workspace,
        args.path
    );

    await fs.rm(filePath, {
        recursive: true,
        force: false
    });
}