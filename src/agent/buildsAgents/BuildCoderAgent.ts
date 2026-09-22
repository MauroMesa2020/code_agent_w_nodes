import {Agent} from "../Agent.js";
import { DefaultGraph} from "../buildsGraphs/DefaultGraph.js";
import tools from "../tools/createTools/code_tools/builsTools.js"; 
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { GeminiProvider } from "../../llm/GeminiProvider.js";
import {GroqProvider} from "../../llm/GroqProvider.js";
import { ProvidersPools } from "../../pools/ProvidersPools.js";

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

/*
    Aca puedo armar mas de un cliente.
*/ 

const providersPools = new ProvidersPools(

    [
        {provider: client, is_available: true, time_available: new Date()},
        {provider: new GroqProvider(), is_available: true, time_available: new Date()}
    ]
);


const graph = DefaultGraph(client, tools);

// Ver si puedo evitar el tercer paraametro y hacer un graph.getToolSignature. 

const CoderAgent = new Agent(systemPrompt, graph, tools);
export default CoderAgent
