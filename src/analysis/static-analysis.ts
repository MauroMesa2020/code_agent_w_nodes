import callLaya from "../llm/Laya.js";
import fs from "fs";

export async function runStaticAnalysis(path: string) {
    const file = fs.readFileSync(path, "utf-8");
    
    const choiceResult = await analizeFile(file, 'what type of vulnerability is this?', 'choice');
    
    return choiceResult;



}

async function analizeFile(file: string, ask:string,  type: "score" | "choice" | "noul") {
    try {
        if (!file) {
            throw new Error("File not found");
        }

        const layaResponse = await callLaya(
            {
                code: file,
            },
            type,
            ask,
            criteria
        );
        return layaResponse;
    } catch (error) {
        console.error(error);
        return "Error analizing file: " + file + "\nError detected: " + error;
    }
}


const criteria = [
    "SQL Injection",
    "XSS",
    "Command Injection",
    "Path Traversal",
    "Hardcoded Secret",
    "Weak Cryptography",
    "Insecure Authentication",
    "Broken Access Control",
    "SSRF",
    "Insecure Deserialization",
    "Insecure File Upload",
    "No vulnerability detected"
];


const severity = [
    "no security vulnerability detected",
    "informational: suspicious pattern but no clear security impact",
    "low: vulnerability has limited impact or requires unlikely conditions",
    "medium: vulnerability could compromise security under realistic conditions",
    "high: vulnerability can cause significant security impact",
    "critical: vulnerability allows severe compromise such as arbitrary code execution, authentication bypass, or major data exposure"
];


            //         Código
            //           │
            //           ▼
            //  ¿Hay vulnerabilidad?
            //         NOUL
            //      /        \
            //    NO          YES
            //    │            │
            //  FINISH          ▼
            //              ¿Cuál?
            //              CHOICE
            //                 │
            //                 ▼
            //             ¿Gravedad?
            //              SCORE
            //                 │
            //                 ▼
            //               FINISH