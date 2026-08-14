import fs from "fs/promises";
import { resolveSafePath } from "./utils.js";

export interface ExistsArgs {
    path: string;
}

export async function exists(
    args: ExistsArgs,
    workspace: string
): Promise<boolean> {

    const filePath = resolveSafePath(workspace, args.path);

    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}