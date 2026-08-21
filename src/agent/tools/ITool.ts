import type { ToolSignature } from "../../shared/utils/utils_tool";

export interface ITool<TArgs = any, TResult = any> {
    signature: ToolSignature;
    run(args: TArgs): Promise<TResult>;
    getSignature(): ToolSignature;
}