import { exec as nodeExec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(nodeExec);

export interface GitStatusArgs {}

export interface GitStatusResult {
    output: string;
    isRepository: boolean;
}

export async function gitStatus(
    _args: GitStatusArgs,
    workspace: string
): Promise<GitStatusResult> {

    try {
        const result = await execAsync(
            "git status --short",
            {
                cwd: workspace,
                timeout: 30_000
            }
        );

        return {
            output: result.stdout.trim(),
            isRepository: true
        };

    } catch (error: any) {

        if (error.stderr?.includes(
            "not a git repository"
        )) {
            return {
                output: "",
                isRepository: false
            };
        }

        throw new Error(
            error.stderr ?? error.message
        );
    }
}