import {Tool} from "./agent/tools/Tool.js";
import type { ToolSignature } from "./shared/utils/utils_tool.js";


import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { GeminiProvider } from "./llm/GeminiProvider.js";
import { BuildFirstGraph } from "./agent/buildsGraphs/BuildFirstGraph.js";
import { Agent } from "./agent/Agent.js";
import fs from "fs/promises";
import type { ITool } from "./agent/tools/ITool.js";


function Suma (args: {a:number, b:number}){
    return args.a + args.b
}

function Resta (args: {a:number, b:number}){
    return args.a - args.b
}

function Multiplicacion (args: {a:number, b:number}){
    return args.a * args.b
}

function Division (args: {a:number, b:number}){
    return args.a / args.b
}

function WriteFile (args: {path:string, content:string}){
    fs.mkdir(path.dirname(args.path), {
        recursive: true
    });

    fs.writeFile(
        args.path,
        args.content,
        "utf-8"
    );
    
}

const signatureSuma: ToolSignature = {

    name: "Suma",

    description: "Suma dos números.",

    parameters: {

        type: "object",

        properties: {

            a: {

                type: "number",

                description: "Primer número."

            },

            b: {

                type: "number",

                description: "Segundo número."

            }

        },

        required: ["a", "b"]

    }

};

const signatureResta: ToolSignature = {

    name: "Resta",

    description: "Resta dos números.",

    parameters: {

        type: "object",

        properties: {

            a: {

                type: "number",

                description: "Primer número."

            },

            b: {

                type: "number",

                description: "Segundo número."

            }

        },

        required: ["a", "b"]
    }
}


const signatureMultiplicacion: ToolSignature = {

    name: "Multiplicacion",

    description: "Multiplica dos números.",

    parameters: {

        type: "object",

        properties: {

            a: {

                type: "number",

                description: "Primer número."

            },

            b: {

                type: "number",

                description: "Segundo número."

            }

        },

        required: ["a", "b"]
    }
};

const signatureDivision: ToolSignature = {

    name: "Division",

    description: "Divide dos números.",

    parameters: {

        type: "object",

        properties: {

            a: {

                type: "number",

                description: "Primer número."

            },

            b: {

                type: "number",

                description: "Segundo número."

            }

        },

        required: ["a", "b"]
    }
};

const signatureWriteFile: ToolSignature = {

    name: "WriteFile",

    description: "Escribe un archivo en el workspace.",

    parameters: {

        type: "object",

        properties: {

            path: {

                type: "string",

                description: "Ruta del archivo relativa al workspace."

            },

            content: {

                type: "string",

                description: "Contenido del archivo."

            }

        },

        required: ["path", "content"]
    }
};


const tool_suma = new Tool(signatureSuma, Suma);
const tool_resta = new Tool(signatureResta, Resta);
const tool_multiplicacion = new Tool(signatureMultiplicacion, Multiplicacion);
const tool_division = new Tool(signatureDivision, Division);
const tool_writeFile = new Tool(signatureWriteFile, WriteFile);

/*
    PROMPTS
*/ 


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
const systemPrompt =
    await readFile(
        promptPath,
        "utf8"
    );

const input = "suma 3 y 6. Luego multiplica por 9. Luego divide por 2. Escribe esto en la direccion ./test.txt";

const client = new GeminiProvider();

const graph = BuildFirstGraph(client, new Map<string, ITool>([
        ["Suma", tool_suma],
        ["Resta", tool_resta],
        ["Multiplicacion", tool_multiplicacion],
        ["Division", tool_division],
        ["WriteFile", tool_writeFile],

]));

const agent = new Agent(systemPrompt, graph, new Map<string, ITool>([
    ["Suma", tool_suma],
    ["Resta", tool_resta],
    ["Multiplicacion", tool_multiplicacion],
    ["Division", tool_division],
    ["WriteFile", tool_writeFile],
]));

const output = await agent.invoke(input);

console.log(output);

/*
    * OUTPUT

{
  messages: [
    {
      role: 'system',
      content: 'You are an agent specialized in solving tasks using tools.\r\n' +
        '\r\n' +
        "Your goal is to complete the user's request.\r\n" +
        '\r\n' +
        'You have the following tools available:\r\n' +
        '\r\n' +
        '\n' +
        'Nombre: Suma\n' +
        'Descripción: Suma dos números.\n' +
        'Parámetros:\n' +
        '{\n' +
        '  "type": "object",\n' +
        '  "properties": {\n' +
        '    "a": {\n' +
        '      "type": "number",\n' +
        '      "description": "Primer número."\n' +
        '    },\n' +
        '    "b": {\n' +
        '      "type": "number",\n' +
        '      "description": "Segundo número."\n' +
        '    }\n' +
        '  },\n' +
        '  "required": [\n' +
        '    "a",\n' +
        '    "b"\n' +
        '  ]\n' +
        '}\n' +
        '\n' +
        '---------------------\n' +
        '\n' +
        'Nombre: Resta\n' +
        'Descripción: Resta dos números.\n' +
        'Parámetros:\n' +
        '{\n' +
        '  "type": "object",\n' +
        '  "properties": {\n' +
        '    "a": {\n' +
        '      "type": "number",\n' +
        '      "description": "Primer número."\n' +
        '    },\n' +
        '    "b": {\n' +
        '      "type": "number",\n' +
        '      "description": "Segundo número."\n' +
        '    }\n' +
        '  },\n' +
        '  "required": [\n' +
        '    "a",\n' +
        '    "b"\n' +
        '  ]\n' +
        '}\n' +
        '\n' +
        '---------------------\n' +
        '\n' +
        'Nombre: Multiplicacion\n' +
        'Descripción: Multiplica dos números.\n' +
        'Parámetros:\n' +
        '{\n' +
        '  "type": "object",\n' +
        '  "properties": {\n' +
        '    "a": {\n' +
        '      "type": "number",\n' +
        '      "description": "Primer número."\n' +
        '    },\n' +
        '    "b": {\n' +
        '      "type": "number",\n' +
        '      "description": "Segundo número."\n' +
        '    }\n' +
        '  },\n' +
        '  "required": [\n' +
        '    "a",\n' +
        '    "b"\n' +
        '  ]\n' +
        '}\n' +
        '\n' +
        '---------------------\n' +
        '\n' +
        'Nombre: Division\n' +
        'Descripción: Divide dos números.\n' +
        'Parámetros:\n' +
        '{\n' +
        '  "type": "object",\n' +
        '  "properties": {\n' +
        '    "a": {\n' +
        '      "type": "number",\n' +
        '      "description": "Primer número."\n' +
        '    },\n' +
        '    "b": {\n' +
        '      "type": "number",\n' +
        '      "description": "Segundo número."\n' +
        '    }\n' +
        '  },\n' +
        '  "required": [\n' +
        '    "a",\n' +
        '    "b"\n' +
        '  ]\n' +
        '}\n' +
        '\n' +
        '---------------------\n' +
        '\n' +
        'Nombre: WriteFile\n' +
        'Descripción: Escribe un archivo en el workspace.\n' +
        'Parámetros:\n' +
        '{\n' +
        '  "type": "object",\n' +
        '  "properties": {\n' +
        '    "path": {\n' +
        '      "type": "string",\n' +
        '      "description": "Ruta del archivo relativa al workspace."\n' +
        '    },\n' +
        '    "content": {\n' +
        '      "type": "string",\n' +
        '      "description": "Contenido del archivo."\n' +
        '    }\n' +
        '  },\n' +
        '  "required": [\n' +
        '    "path",\n' +
        '    "content"\n' +
        '  ]\n' +
        '}\n' +
        '\r\n' +
        '\r\n' +
        'You must always respond EXCLUSIVELY with valid JSON.\r\n' +
        '\r\n' +
        'The format is:\r\n' +
        '\r\n' +
        '{\r\n' +
        '    "tool_call": {\r\n' +
        '        "toolName": "name",\r\n' +
        '        "toolArgs": {\r\n' +
        '        }\r\n' +
        '    },\r\n' +
        '    "response": ""\r\n' +
        '}\r\n' +
        '\r\n' +
        'If you need to use a tool:\r\n' +
        '\r\n' +
        '- response must be an empty string.\r\n' +
        '- tool_call must contain exactly one tool.\r\n' +
        '\r\n' +
        'When you no longer need to use tools:\r\n' +
        '\r\n' +
        '{\r\n' +
        '    "tool_call": null,\r\n' +
        '    "response": "Final answer for the user."\r\n' +
        '}\r\n' +
        '\r\n' +
        'Do not write explanations.\r\n' +
        '\r\n' +
        'Do not use Markdown.\r\n' +
        '\r\n' +
        'Do not add text before or after the JSON.\r\n' +
        '\r\n' +
        'Do not invent tool results.\r\n' +
        '\r\n' +
        'If a tool returns information, use it to continue reasoning until the task is complete.\r\n' +
        '\r\n' +
        'When responding to the user, write a natural and friendly answer explaining what you did.'
    },
    {
      role: 'user',
      content: 'suma 3 y 6. Luego multiplica por 9. Luego divide por 2. Escribe esto en la direccion ./test.txt'
    },
    {
      role: 'assistant',
      content: '{\n' +
        '    "tool_call": {\n' +
        '        "toolName": "Suma",\n' +
        '        "toolArgs": {\n' +
        '            "a": 3,\n' +
        '            "b": 6\n' +
        '        }\n' +
        '    },\n' +
        '    "response": ""\n' +
        '}'
    },
    { role: 'tool', content: '9' },
    {
      role: 'assistant',
      content: '{\n' +
        '    "tool_call": {\n' +
        '        "toolName": "Multiplicacion",\n' +
        '        "toolArgs": {\n' +
        '            "a": 9,\n' +
        '            "b": 9\n' +
        '        }\n' +
        '    },\n' +
        '    "response": ""\n' +
        '}'
    },
    { role: 'tool', content: '81' },
    {
      role: 'assistant',
      content: '{\n' +
        '    "tool_call": {\n' +
        '        "toolName": "Division",\n' +
        '        "toolArgs": {\n' +
        '            "a": 81,\n' +
        '            "b": 2\n' +
        '        }\n' +
        '    },\n' +
        '    "response": ""\n' +
        '}'
    },
    { role: 'tool', content: '40.5' },
    {
      role: 'assistant',
      content: '{\n' +
        '    "tool_call": {\n' +
        '        "toolName": "WriteFile",\n' +
        '        "toolArgs": {\n' +
        '            "path": "./test.txt",\n' +
        '            "content": "40.5"\n' +
        '        }\n' +
        '    },\n' +
        '    "response": ""\n' +
        '}'
    },
    { role: 'tool', content: undefined },
    {
      role: 'assistant',
      content: '{\n' +
        '    "tool_call": null,\n' +
        `    "response": "¡Hola! He realizado los cálculos que me pediste. Primero sumé 3 y 6, obteniendo 9. Luego multipliqué ese resultado por 9, lo que me dio 81.Finalmente, dividí 81 entre 2, con un resultado de 40.5. Este último valor lo he guardado en el archivo './test.txt' para ti."\n` +
        '}'
    }
  ],
  finished: true,
  artifacts: [],
  response: "¡Hola! He realizado los cálculos que me pediste. Primero sumé 3 y 6, obteniendo 9. Luego multipliqué ese resultado por 9, lo que me dio 81. Finalmente, dividí 81 entre 2, con un resultado de 40.5. Este último valor lo he guardado en el archivo './test.txt' para ti.",
  lastResponse: "¡Hola! He realizado los cálculos que me pediste. Primero sumé 3 y 6, obteniendo 9. Luego multipliqué ese resultado por 9, lo que me dio 81. Finalmente, dividí 81 entre 2, con un resultado de 40.5. Este último valor lo he guardado en el archivo './test.txt' para ti.",
  toolCall: null,
  error: undefined,
  toolResult: undefined
}

*/