Custom State-Graph Multi-Agent Architecture

Este proyecto tiene como objetivo entender como funciona internamente un framework de agentes de AI como Langchain, mas
especificamente su implementacion de LangGraph. 

Arquitectura: State Pattern, Graph-Based Execution, Event-Driven State Updates

Para ello, se construyó desde cero un proyecto donde no se uso framework de ningún tipo, con el objetivo de aprender como actua
cada nodo, como se maneja el input y output con el LLM, ademas de entender como se manejan las Tools (o simplemente funciones) que el 
agente debe conocer y ejecutar.

La ejecución del agente se hizo basandome en la arquitecura de grafos, donde cada nodo representa una accion a tomar, y todos ellos 
conociendo un restringido contexto al cual llamé State, funcionando como una maquina de estados. 

Este state tiene los diferentes compos: 

export interface State {

    messages: Message[];

    lastResponse?: string;
    
    toolCall?: ToolCall | undefined;

    finished: boolean;

    toolResult?: unknown;

    response?: string;

    error?: AgentError | undefined;

    artifacts: Artifact[];

} 

