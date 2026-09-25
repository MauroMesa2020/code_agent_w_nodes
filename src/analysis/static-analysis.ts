import callLaya from "../llm/Laya.js";
import fs from "fs";

export async function runStaticAnalysis(path: string) {
    const file = fs.readFileSync(path, "utf-8");
    return analizeFile(file);
}

async function analizeFile(file: string) {
    try {
        if (!file) {
            throw new Error("File not found");
        }

        // score = escala ordinal (bajo → alto). No mezclar tipos de vuln (eso es choice).
        const layaResponse = await callLaya(
            {
                code: file,
            },
            "score",
            "How severe is the SQL injection risk in this code?",
            [
                "no SQL injection risk; queries are parameterized or have no user-controlled input",
                "weak query construction but unclear if attacker-controlled input reaches SQL",
                "user input is concatenated or interpolated into SQL; likely injectable",
                "clear SQL injection: untrusted input directly builds executable SQL",
                "XSS vulnerability: unescaped user input is directly rendered in HTML",
                "other vulnerability: unvalidated user input is used in a database query",
                // Add more options as needed
            ]
        );
        return layaResponse;
    } catch (error) {
        console.error(error);
        return "Error analizing file: " + file + "\nError detected: " + error;
    }
}


