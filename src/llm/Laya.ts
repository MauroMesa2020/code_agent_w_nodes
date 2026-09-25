import { Laya } from "@receptron/laya";

type LayaType = "choice" | "score" | "noul";

export default async function callLaya(
    task: string | object,
    type: LayaType,
    instructions: string,
    criteria: string[] = [],
) {
    console.log("Start Laya...");

    const laya = await Laya.load();

    switch (type) {
        case "choice": {
            return await laya.systemOne(task, {
                action: {
                    type: "choice",
                    instructions,
                    criteria,
                },
            });
        }

        case "score": {
            return await laya.systemOne(task, {
                action: {
                    type: "score",
                    instructions,
                    criteria,
                },
            });
        }

        case "noul": {
            return await laya.systemOne(task, {
                action: {
                    type: "noul",
                    instructions,
                },
            });
        }
    }
}