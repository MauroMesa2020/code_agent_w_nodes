export interface INode<TState> {

    readonly id: string;

    execute(state: TState): Promise<TState>;

}