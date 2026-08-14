import { exec as nodeExec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(nodeExec);

export interface GitDiffArgs {
    staged?: boolean;
}

export async function gitDiff(
    args: GitDiffArgs,
    workspace: string
): Promise<string> {

    const command = args.staged
        ? "git diff --cached"
        : "git diff";

    try {

        const result = await execAsync(
            command,
            {
                cwd: workspace,
                timeout: 30_000,
                maxBuffer: 10 * 1024 * 1024
            }
        );

        return result.stdout;

    } catch (error: any) {

        throw new Error(
            error.stderr ?? error.message
        );
    }
}