import {Agent} from "../Agent.js";
import { DefaultGraph} from "../buildsGraphs/DefaultGraph.js";
import tools from "../tools/createTools/code_tools/builsTools.js"; 
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { GeminiProvider } from "../../llm/GeminiProvider.js";
// recrear __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(
    process.cwd(),
    "src",
    "agent",
    "systemPrompts",
    "Prueba.md"
);
export const systemPrompt =
    await readFile(
        promptPath,
        "utf8"
    );

const client = new GeminiProvider();

const graph = DefaultGraph(client, tools);

// Ver si puedo evitar el tercer paraametro y hacer un graph.getToolSignature. 

const CoderAgent = new Agent(systemPrompt, graph, tools);
export default CoderAgent
