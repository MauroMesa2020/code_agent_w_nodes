//Pasar todo a ingles.

import type {ToolSignature} from "../../../../shared/utils/utils_tool.js";
import type { ITool } from "../../ITool.js";
import {Tool} from "../../Tool.js";
import type { DeleteArgs } from "./filesystem/delete.js";
import type { ExistsArgs } from "./filesystem/exists.js";
import type { FindFilesArgs } from "./filesystem/findFiles.js";
const workspace = process.cwd();
import {
    read,
    write,
    listDirectory,
    deleteFile,
    exists,
    search,
    tree,
    findFiles,
    mkdir,
    exec,
    gitDiff,
    gitStatus
} from "./index.js";
import type { ListDirectoryArgs } from "./filesystem/listDirectory.js";
import type { MkdirArgs } from "./filesystem/mkdir.js";

import type { ReadArgs } from "./filesystem/read.js";
import type { SearchArgs } from "./filesystem/search.js";
import type { TreeArgs } from "./filesystem/tree.js";
import type { WriteArgs } from "./filesystem/write.js";
import type { ExecArgs } from "./execution/exec.js";
import type { GitStatusArgs } from "./git/gitStatus.js";
import type { GitDiffArgs } from "./git/gitDiff.js";

const signatureRead: ToolSignature = {

    name: "read",

    description:
        "Lee y devuelve el contenido completo de un archivo del workspace.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del archivo relativa al workspace."
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolRead = new Tool(
    signatureRead,
    (args: ReadArgs) => read(args, workspace),
);

const signatureWrite: ToolSignature = {

    name: "write",

    description:
        "Crea o sobrescribe un archivo con el contenido proporcionado. Si el archivo ya existe, su contenido será reemplazado.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del archivo relativa al workspace."
            },

            content: {
                type: "string",
                description:
                    "Contenido completo que se escribirá en el archivo."
            }

        },

        required: ["path", "content"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolWrite = new Tool(
    signatureWrite,
    (args: WriteArgs) => write(args, workspace),
);

const signatureListDirectory: ToolSignature = {

    name: "listDirectory",

    description:
        "Lista los archivos y directorios contenidos directamente dentro de un directorio.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del directorio relativa al workspace. Usa '.' para el directorio raíz del workspace."
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolListDirectory = new Tool(
    signatureListDirectory,
    (args: ListDirectoryArgs) => listDirectory(args, workspace),
);

const signatureTree: ToolSignature = {

    name: "tree",

    description:
        "Construye un árbol recursivo de archivos y directorios a partir de una ruta.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del directorio desde donde comenzar el árbol, relativa al workspace."
            },

            maxDepth: {
                type: "integer",
                description:
                    "Profundidad máxima del árbol. Úsalo para evitar recorrer proyectos demasiado grandes.",
                default: 5
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolTree = new Tool(
    signatureTree,
    (args: TreeArgs) => tree(args, workspace),
);

const signatureSearch: ToolSignature = {

    name: "search",

    description:
        "Busca texto dentro de los archivos del workspace y devuelve las coincidencias encontradas junto con su ubicación y contexto.",

    parameters: {

        type: "object",

        properties: {

            query: {
                type: "string",
                description:
                    "Texto o patrón que se desea buscar."
            },

            path: {
                type: "string",
                description:
                    "Directorio o archivo donde realizar la búsqueda, relativo al workspace."
            },

            context: {
                type: "integer",
                description:
                    "Cantidad de líneas de contexto que se deben incluir antes y después de cada coincidencia.",
                default: 0
            }

        },

        required: ["query"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolSearch = new Tool(
    signatureSearch,
    (args: SearchArgs) => search(args, workspace),
);

const signatureFindFiles: ToolSignature = {

    name: "findFiles",

    description:
        "Busca archivos dentro del workspace utilizando un patrón de nombre o extensión.",

    parameters: {

        type: "object",

        properties: {

            pattern: {
                type: "string",
                description:
                    "Patrón utilizado para buscar archivos, por ejemplo '*.ts', '*.py' o 'Agent.ts'."
            },

            path: {
                type: "string",
                description:
                    "Directorio desde donde comenzar la búsqueda, relativo al workspace."
            }

        },

        required: ["pattern"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolFindFiles = new Tool(
    signatureFindFiles,
    (args: FindFilesArgs) => findFiles(args, workspace),
);

const signatureExists: ToolSignature = {

    name: "exists",

    description:
        "Comprueba si existe un archivo o directorio en el workspace.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del archivo o directorio relativa al workspace."
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolExists = new Tool(
    signatureExists,
    (args: ExistsArgs) => exists(args, workspace),
);


const signatureMkdir: ToolSignature = {

    name: "mkdir",

    description:
        "Crea un directorio en el workspace. También puede crear los directorios padre necesarios.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del nuevo directorio relativa al workspace."
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolMkdir = new Tool(
    signatureMkdir,
    (args: MkdirArgs) => mkdir(args, workspace),
);

const signatureDelete: ToolSignature = {

    name: "delete",

    description:
        "Elimina un archivo o directorio del workspace. Esta operación es destructiva y no puede deshacerse automáticamente.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta del archivo o directorio que se desea eliminar, relativa al workspace."
            }

        },

        required: ["path"]
    },

    category: "filesystem",
    version: "1.0",
    strict: true
};

const toolDelete = new Tool(
    signatureDelete,
    (args: DeleteArgs) => deleteFile(args, workspace),
);

const signatureExec: ToolSignature = {

    name: "exec",

    description:
        "Ejecuta un comando del sistema dentro del workspace y devuelve su salida estándar, salida de error y código de salida.",

    parameters: {

        type: "object",

        properties: {

            command: {
                type: "string",
                description:
                    "Comando que se desea ejecutar. El comando se ejecutará desde el workspace actual."
            },

            timeout: {
                type: "integer",
                description:
                    "Tiempo máximo de ejecución en milisegundos antes de terminar el proceso.",
                default: 30000
            }

        },

        required: ["command"]
    },

    category: "execution",
    version: "1.0",
    strict: true
};

const toolExec = new Tool(
    signatureExec,
    (args: ExecArgs) => exec(args, workspace),
);

const signatureGitStatus: ToolSignature = {

    name: "gitStatus",

    description:
        "Obtiene el estado actual del repositorio Git del workspace, incluyendo archivos modificados, agregados, eliminados y no rastreados.",

    parameters: {

        type: "object",

        properties: {},

        required: []
    },

    category: "git",
    version: "1.0",
    strict: true
};

const toolGitStatus = new Tool(
    signatureGitStatus,
    (args: GitStatusArgs) => gitStatus(args, workspace),
);

const signatureGitDiff: ToolSignature = {

    name: "gitDiff",

    description:
        "Muestra los cambios realizados en el repositorio Git del workspace. Puede mostrar todos los cambios o limitar el resultado a un archivo específico.",

    parameters: {

        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Ruta opcional de un archivo relativo al workspace. Si no se especifica, se muestran los cambios de todos los archivos."
            }

        },

        required: []
    },

    category: "git",
    version: "1.0",
    strict: true
};

const toolGitDiff = new Tool(
    signatureGitDiff,
    (args: GitDiffArgs) => gitDiff(args, workspace),
);

const tools = new Map<string, ITool>();

tools.set("read", toolRead);
tools.set("write", toolWrite);
tools.set("listDirectory", toolListDirectory);
tools.set("tree", toolTree);
tools.set("search", toolSearch);
tools.set("findFiles", toolFindFiles);
tools.set("exists", toolExists);
tools.set("mkdir", toolMkdir);
tools.set("delete", toolDelete);

tools.set("exec", toolExec);

tools.set("gitStatus", toolGitStatus);
tools.set("gitDiff", toolGitDiff);

export default tools;