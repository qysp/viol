import { AlpineComponent } from './Component';
export declare type IsEmpty<T, Y = true, N = false> = T extends {
    [key: string]: never;
} ? Y : N;
export declare type State = Record<string, any>;
export declare type Props = Record<string, any>;
export declare type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
    style?: string;
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
export interface AlpineElement<E extends HTMLElement, C extends AlpineComponent> {
    __x: {
        $data: C;
        $el: AlpineElement<E, C>;
        membrane: object;
        nextTickStack: (() => void)[];
        pauseReactivity: boolean;
        showDirectiveLastElement?: E;
        showDirectiveStack: (() => void)[];
        unobservedData: C;
        watchers: Record<string, ((value: unknown) => void)[]>;
        updateElement(el: HTMLElement, extraVars?: () => any): void;
        updateElements(rootEl: HTMLElement, extraVars?: () => any): void;
    };
    __x_original_classes?: string[];
    __x_is_shown?: boolean;
    __x_inserted_me?: boolean;
    __x_for_key?: string;
}
