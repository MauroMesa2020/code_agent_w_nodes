import fs from "fs/promises";
import * as ts from "typescript";
import { resolveSafePath } from "../filesystem/utils.js";


//Mejorar los ! de las lineas 66 y 86 para que den undefined.

interface GetDependenciesArgs {
    path: string;
}

interface DependencyInfo {
    module: string;
    type: "local" | "external";
}

interface GetDependenciesResult {
    file: string;
    dependencies: DependencyInfo[];
}

export async function getDependencies(
    args: GetDependenciesArgs,
    workspace: string
): Promise<GetDependenciesResult> {

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

    const dependencies: DependencyInfo[] = [];

    function visit(node: ts.Node): void {

        if (ts.isImportDeclaration(node)) {

            const module = node.moduleSpecifier
                .getText(sourceFile)
                .replace(/^["']|["']$/g, "");

            dependencies.push({
                module,
                type: isLocalModule(module)
                    ? "local"
                    : "external"
            });
        }

        /*
         * require("...")
         */
        if (
            ts.isCallExpression(node) &&
            node.expression.getText(sourceFile) === "require" &&
            node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0]!)
        ) {

            const module = node.arguments[0].text;

            dependencies.push({
                module,
                type: isLocalModule(module)
                    ? "local"
                    : "external"
            });
        }

        /*
         * import("...")
         */
        if (
            ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0]!)
        ) {

            const module = node.arguments[0].text;

            dependencies.push({
                module,
                type: isLocalModule(module)
                    ? "local"
                    : "external"
            });
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return {
        file: args.path,
        dependencies: uniqueDependencies(dependencies)
    };
}

function isLocalModule(module: string): boolean {
    return (
        module.startsWith("./") ||
        module.startsWith("../") ||
        module === "." ||
        module === ".."
    );
}

function uniqueDependencies(
    dependencies: DependencyInfo[]
): DependencyInfo[] {

    const seen = new Set<string>();
    const result: DependencyInfo[] = [];

    for (const dependency of dependencies) {

        const key =
            `${dependency.type}:${dependency.module}`;

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(dependency);
    }

    return result;
}