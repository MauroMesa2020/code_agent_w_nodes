// utils.ts

import path from "path";

export function resolveSafePath(
    workspace: string,
    targetPath: string
): string {

    const workspacePath = path.resolve(workspace);
    const resolvedPath = path.resolve(workspace, targetPath);

    if (
        resolvedPath !== workspacePath &&
        !resolvedPath.startsWith(workspacePath + path.sep)
    ) {
        throw new Error(
            `Path "${targetPath}" is outside the workspace.`
        );
    }

    return resolvedPath;
}