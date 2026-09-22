import type { Message } from "../shared/utils/utils_tool.js";
import type {IProvider} from "./IProvider.js";

export class GroqProvider implements IProvider {


    async invoke(arg: Message[]): Promise<string>{
        return "";
    }
}