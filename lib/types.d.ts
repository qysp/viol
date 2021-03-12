import { AlpineComponent } from './Component';
export declare type IsEmpty<T, Y = true, N = false> = T extends {
    [key: string]: never;
} ? Y : N;
export declare type State = Record<string, any>;
export declare type Props = Record<string, any>;
export declare type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
} & IsEmpty<StateOf<C>, {
    state?: StateOf<C>;
}, {
    state: StateOf<C>;
}>;
export declare type PropsOf<C> = C extends AlpineComponent<State, infer P> ? P : never;
export declare type StateOf<C> = C extends AlpineComponent<infer S, Props> ? S : never;
export declare type TemplateArgs<C extends AlpineComponent> = {
    state: StateOf<C>;
    props: PropsOf<C>;
    self: C;
};
export declare type TemplateFunction<C extends AlpineComponent = AlpineComponent> = (args: TemplateArgs<C>) => string;
export declare type Template<C extends AlpineComponent> = string | TemplateFunction<C>;
export declare type Substitute<C extends AlpineComponent> = string | number | boolean | AlpineComponent | ((args: TemplateArgs<C>) => AlpineComponent | string);
