import fs from "fs/promises";
import * as ts from "typescript";
import { resolveSafePath } from "../filesystem/utils.js";

interface GetSymbolsArgs {
    path: string;
}

interface SymbolInfo {
    name: string;
    line: number;
}

interface MethodInfo {
    name: string;
    line: number;
}

interface ClassInfo extends SymbolInfo {
    methods: MethodInfo[];
}

interface ImportInfo {
    name: string;
    line: number;
}

interface GetSymbolsResult {
    file: string;
    classes: ClassInfo[];
    functions: SymbolInfo[];
    interfaces: SymbolInfo[];
    types: SymbolInfo[];
    enums: SymbolInfo[];
    imports: ImportInfo[];
    exports: string[];
}

export async function getSymbols(
    args: GetSymbolsArgs,
    workspace: string
): Promise<GetSymbolsResult> {

    const filePath = resolveSafePath(
        workspace,
        args.path
    );

    const content = await fs.readFile(
        filePath,
        "utf-8"
    );

    const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true
    );

    const result: GetSymbolsResult = {
        file: args.path,
        classes: [],
        functions: [],
        interfaces: [],
        types: [],
        enums: [],
        imports: [],
        exports: []
    };

    function getLine(node: ts.Node): number {
        return sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile)
        ).line + 1;
    }

    function visit(node: ts.Node): void {

        /*
         * Classes
         */
        if (ts.isClassDeclaration(node)) {

            if (node.name) {

                const methods: MethodInfo[] = [];

                for (const member of node.members) {

                    if (
                        ts.isMethodDeclaration(member) &&
                        member.name
                    ) {

                        const name = member.name
                            .getText(sourceFile);

                        methods.push({
                            name,
                            line: getLine(member)
                        });
                    }

                    if (
                        ts.isConstructorDeclaration(member)
                    ) {

                        methods.push({
                            name: "constructor",
                            line: getLine(member)
                        });
                    }
                }

                result.classes.push({
                    name: node.name.text,
                    line: getLine(node),
                    methods
                });
            }
        }

        /*
         * Functions
         */
        if (ts.isFunctionDeclaration(node)) {

            if (node.name) {

                result.functions.push({
                    name: node.name.text,
                    line: getLine(node)
                });
            }
        }

        /*
         * Interfaces
         */
        if (ts.isInterfaceDeclaration(node)) {

            result.interfaces.push({
                name: node.name.text,
                line: getLine(node)
            });
        }

        /*
         * Types
         */
        if (ts.isTypeAliasDeclaration(node)) {

            result.types.push({
                name: node.name.text,
                line: getLine(node)
            });
        }

        /*
         * Enums
         */
        if (ts.isEnumDeclaration(node)) {

            result.enums.push({
                name: node.name.text,
                line: getLine(node)
            });
        }

        /*
         * Imports
         */
        if (ts.isImportDeclaration(node)) {

            const clause = node.importClause;

            if (clause) {

                /*
                 * import Foo from "..."
                 */
                if (clause.name) {

                    result.imports.push({
                        name: clause.name.text,
                        line: getLine(node)
                    });
                }

                /*
                 * import { Foo, Bar } from "..."
                 */
                if (
                    clause.namedBindings &&
                    ts.isNamedImports(
                        clause.namedBindings
                    )
                ) {

                    for (
                        const element
                        of clause.namedBindings.elements
                    ) {

                        result.imports.push({
                            name: element.name.text,
                            line: getLine(element)
                        });
                    }
                }

                /*
                 * import * as Foo from "..."
                 */
                if (
                    clause.namedBindings &&
                    ts.isNamespaceImport(
                        clause.namedBindings
                    )
                ) {

                    result.imports.push({
                        name:
                            clause.namedBindings.name.text,
                        line: getLine(node)
                    });
                }
            }
        }

        /*
         * Exports
         */
        if (
            ts.isExportDeclaration(node)
        ) {

            if (
                node.exportClause &&
                ts.isNamedExports(node.exportClause)
            ) {

                for (
                    const element
                    of node.exportClause.elements
                ) {

                    result.exports.push(
                        element.name.text
                    );
                }
            }
        }

        /*
         * export class/function/interface/etc.
         *
         * Estos exports vienen como modificadores
         * del propio declaration.
         */
        if (
            ts.isClassDeclaration(node) ||
            ts.isFunctionDeclaration(node) ||
            ts.isInterfaceDeclaration(node) ||
            ts.isTypeAliasDeclaration(node) ||
            ts.isEnumDeclaration(node)
        ) {

            if (
                node.modifiers?.some(
                    modifier =>
                        modifier.kind ===
                        ts.SyntaxKind.ExportKeyword
                )
            ) {

                const declarationName =
                    "name" in node
                        ? node.name
                        : undefined;

                if (
                    declarationName &&
                    ts.isIdentifier(declarationName)
                ) {

                    result.exports.push(
                        declarationName.text
                    );
                }
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return result;
}