import type { Agent } from "./Agent.js";
import CoderAgent from "./buildsAgents/BuildCoderAgent.js";

export default function AgentFactory(type: string): Agent | Agent[] {
    switch(type){
        case "coder":
            return CoderAgent;
        case "planner-coder-verify": 
            return [CoderAgent, CoderAgent];
        default:
            return CoderAgent
    }
} 
