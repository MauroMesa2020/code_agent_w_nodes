import type { Message } from "../shared/utils/utils_tool.js";

export interface IProvider{
    invoke(arg: Message[]): Promise<string>;
}