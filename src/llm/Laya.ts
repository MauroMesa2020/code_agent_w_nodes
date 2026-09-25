import { Laya } from "@receptron/laya";

type Types = "choice" | "score" | "noul";

interface Criteria {
    name: string;
    description: string;
}

export default async function callLaya(
    task: string | object,
    type: Types,
    instructions: string,
    criteria: Criteria[] | string[] = [],
) {
    console.log("Start Laya...");

    const laya = await Laya.load();

    switch (type) {
        case "choice": {
            const choiceCriteria = criteria as Criteria[];
            const result = await laya.systemOne(task, {
                action: {
                    type: "choice",
                    instructions,
                    criteria: Object.fromEntries(
                        choiceCriteria.map((c) => [c.name, c.description]),
                    ),
                },
            });
            return result;
        }
        case "score": {
            const levels = (criteria as (Criteria | string)[]).map((c) =>
                typeof c === "string" ? c : c.name,
            );
            const result = await laya.systemOne(task, {
                action: {
                    type: "score",
                    instructions,
                    criteria: levels,
                },
            });
            return result;
        }
        case "noul": {
            const result = await laya.systemOne(task, {
                action: {
                    type: "noul",
                    instructions,
                },
            });
            return result;
        }
    }
}
