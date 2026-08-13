import fs from "fs/promises";
import * as ts from "typescript";
import { resolveSafePath } from "../filesystem/utils.js";

interface AnalyzeCodeArgs {
    path: string;
}

interface ComplexityInfo {
    if: number;
    for: number;
    while: number;
    switch: number;
    try: number;
    catch: number;
}

interface AnalyzeCodeResult {
    file: string;
    language: "typescript" | "tsx";
    lines: number;
    imports: number;
    exports: number;
    classes: number;
    functions: number;
    interfaces: number;
    types: number;
    enums: number;
    methods: number;
    properties: number;
    complexity: ComplexityInfo;
    dependencies: string[];
}

export async function analyzeCode(
    args: AnalyzeCodeArgs,
    workspace: string
): Promise<AnalyzeCodeResult> {

    const filePath = resolveSafePath(
        workspace,
        args.path
    );

    const content = await fs.readFile(
        filePath,
        "utf-8"
    );

    const language =
        filePath.endsWith(".tsx")
            ? "tsx"
            : "typescript";

    const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true
    );

    const result: AnalyzeCodeResult = {
        file: args.path,
        language,
        lines: content.split(/\r?\n/).length,
        imports: 0,
        exports: 0,
        classes: 0,
        functions: 0,
        interfaces: 0,
        types: 0,
        enums: 0,
        methods: 0,
        properties: 0,
        complexity: {
            if: 0,
            for: 0,
            while: 0,
            switch: 0,
            try: 0,
            catch: 0
        },
        dependencies: []
    };

    function visit(node: ts.Node): void {

        if (ts.isImportDeclaration(node)) {

            result.imports++;

            if (ts.isStringLiteral(node.moduleSpecifier)) {
                result.dependencies.push(
                    node.moduleSpecifier.text
                );
            }
        }

        if (ts.isClassDeclaration(node)) {

            result.classes++;

            for (const member of node.members) {

                if (
                    ts.isMethodDeclaration(member) ||
                    ts.isConstructorDeclaration(member) ||
                    ts.isGetAccessorDeclaration(member) ||
                    ts.isSetAccessorDeclaration(member)
                ) {
                    result.methods++;
                }

                if (
                    ts.isPropertyDeclaration(member)
                ) {
                    result.properties++;
                }
            }
        }

        if (ts.isFunctionDeclaration(node)) {
            result.functions++;
        }

        if (ts.isInterfaceDeclaration(node)) {
            result.interfaces++;
        }

        if (ts.isTypeAliasDeclaration(node)) {
            result.types++;
        }

        if (ts.isEnumDeclaration(node)) {
            result.enums++;
        }

        if (ts.isExportDeclaration(node)) {
            result.exports++;
        }

        /*
         * export class Foo {}
         * export function foo() {}
         * etc.
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
                result.exports++;
            }
        }

        if (
            node.kind === ts.SyntaxKind.IfStatement
        ) {
            result.complexity.if++;
        }

        if (
            node.kind === ts.SyntaxKind.ForStatement ||
            node.kind === ts.SyntaxKind.ForOfStatement ||
            node.kind === ts.SyntaxKind.ForInStatement
        ) {
            result.complexity.for++;
        }

        if (
            node.kind === ts.SyntaxKind.WhileStatement ||
            node.kind === ts.SyntaxKind.DoStatement
        ) {
            result.complexity.while++;
        }

        if (
            node.kind === ts.SyntaxKind.SwitchStatement
        ) {
            result.complexity.switch++;
        }

        if (
            node.kind === ts.SyntaxKind.TryStatement
        ) {
            result.complexity.try++;
        }

        if (
            node.kind === ts.SyntaxKind.CatchClause
        ) {
            result.complexity.catch++;
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return result;
}