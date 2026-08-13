import { exec as nodeExec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(nodeExec);

interface ExecArgs {
    command: string;
    timeout?: number;
}

interface ExecResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

export async function exec(
    args: ExecArgs,
    workspace: string
): Promise<ExecResult> {

    try {
        const result = await execAsync(args.command, {
            cwd: workspace,
            timeout: args.timeout ?? 120_000,
            maxBuffer: 10 * 1024 * 1024
        });

        return {
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: 0
        };

    } catch (error: any) {

        return {
            stdout: error.stdout ?? "",
            stderr: error.stderr ?? error.message ?? "",
            exitCode: error.code ?? 1
        };
    }
}