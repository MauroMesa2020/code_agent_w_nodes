import { Graph } from "./Graph.js";
import type { State } from "../shared/types/State.js";
import type { ITool } from "./tools/ITool.js";

export class Agent{

    private systemPrompt: string;
    constructor(
        systemPrompt: string,
        private graph: Graph<State>,
        private tools: Map<string, ITool>
    ){
        this.systemPrompt = systemPrompt;
    }

    private buildToolSection(): string {

        return [...this.tools.values()]
            .map(tool => {

                const sig = tool.getSignature();

        return `
Nombre: ${sig.name}
Descripción: ${sig.description}
Parámetros:
${JSON.stringify(sig.parameters, null, 2)}
`;

})
.join("\n---------------------\n");

    }

    invoke(input: string){
        const prompt = this.systemPrompt.replace(
            "{{TOOLS}}",
            this.buildToolSection()
        );

        console.log(`El prompt con las tools queda como:\n\n${prompt}\n\n`);

        const state: State = {
            messages: [
                {role: "system", content: prompt},
                {role: "user", content: input}
            ],
            finished: false
        }

        return this.graph.run(
        "think",
        state
    );

    }

}