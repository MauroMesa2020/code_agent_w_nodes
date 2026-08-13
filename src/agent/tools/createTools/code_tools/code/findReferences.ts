import fs from "fs/promises";
import path from "path";
import * as ts from "typescript";
import { resolveSafePath } from "../filesystem/utils.js";

interface FindReferencesArgs {
    symbol: string;
    path?: string;
}

interface Reference {
    file: string;
    line: number;
    context: string;
}

interface FindReferencesResult {
    symbol: string;
    references: Reference[];
}

export async function findReferences(
    args: FindReferencesArgs,
    workspace: string
): Promise<FindReferencesResult> {

    const configPath = ts.findConfigFile(
        workspace,
        ts.sys.fileExists,
        "tsconfig.json"
    );

    let fileNames: string[] = [];

    let compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        allowJs: false
    };

    if (configPath) {

        const configFile =
            ts.readConfigFile(
                configPath,
                ts.sys.readFile
            );

        if (!configFile.error) {

            const parsedConfig =
                ts.parseJsonConfigFileContent(
                    configFile.config,
                    ts.sys,
                    path.dirname(configPath)
                );

            fileNames = parsedConfig.fileNames;
            compilerOptions =
                parsedConfig.options;
        }
    }

    if (fileNames.length === 0) {

        fileNames = collectTypeScriptFiles(
            workspace
        );
    }

    const program = ts.createProgram(
        fileNames,
        compilerOptions
    );

    const checker =
        program.getTypeChecker();

    const references: Reference[] = [];

    for (const sourceFile of program.getSourceFiles()) {

        if (
            sourceFile.isDeclarationFile ||
            sourceFile.fileName.includes(
                "node_modules"
            )
        ) {
            continue;
        }

        function visit(node: ts.Node): void {

            if (
                ts.isIdentifier(node) &&
                node.text === args.symbol
            ) {

                const symbol =
                    checker.getSymbolAtLocation(node);

                if (!symbol) {
                    return;
                }

                const declarations =
                    symbol.getDeclarations();

                if (!declarations) {
                    return;
                }

                const line =
                    sourceFile
                        .getLineAndCharacterOfPosition(
                            node.getStart(sourceFile)
                        )
                        .line + 1;

                const lineStart =
                    sourceFile.getLineStarts()[line - 1];

                const nextLineStart =
                    sourceFile.getLineStarts()[line]
                    ?? sourceFile.end;

                const context =
                    sourceFile.text
                        .slice(
                            lineStart,
                            nextLineStart
                        )
                        .trim();

                references.push({
                    file: path.relative(
                        workspace,
                        sourceFile.fileName
                    ),
                    line,
                    context
                });
            }

            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
    }

    return {
        symbol: args.symbol,
        references: uniqueReferences(
            references
        )
    };
}

function collectTypeScriptFiles(
    workspace: string
): string[] {

    const files: string[] = [];

    function walk(directory: string): void {

        for (const entry of ts.sys.readDirectory(
            directory,
            [".ts", ".tsx"],
            undefined,
            undefined
        )) {

            files.push(entry);
        }
    }

    walk(workspace);

    return files;
}

function uniqueReferences(
    references: Reference[]
): Reference[] {

    const seen = new Set<string>();
    const result: Reference[] = [];

    for (const reference of references) {

        const key =
            `${reference.file}:${reference.line}`;

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(reference);
    }

    return result;
}