import type {ToolSignature } from "../../shared/utils/utils_tool";
import type {ITool} from "./ITool.js"

export class Tool <TArgs, TResult> implements ITool {
    signature: ToolSignature;
    private fn: (args: TArgs) => TResult | Promise<TResult>;

    
    constructor(
        signature: ToolSignature,
        fn: (args: TArgs) => TResult | Promise<TResult>,
    ) {
        this.fn = fn;
        this.signature = signature;
    }

    async run(args: TArgs): Promise<TResult> {
        return Promise.resolve(this.fn(args));
    }

    getSignature(){
        return this.signature;
    }
    
}

