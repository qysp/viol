import { AlpineComponent } from './Component';
export declare type IsEmpty<T, Y = true, N = false> = T extends {
    [key: string]: never;
} ? Y : N;
export declare type State = Record<string, any>;
export declare type Props = Record<string, any>;
export declare type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
    styles?: Styles<C>;
} & IsEmpty<StateOf<C>, {
    state?: StateOf<C>;
}, {
    state: StateOf<C>;
}>;
export declare type PropsOf<C> = C extends AlpineComponent<State, infer P> ? P : never;
export declare type StateOf<C> = C extends AlpineComponent<infer S, Props> ? S : never;
export declare type SubstituteArgs<C extends AlpineComponent> = {
    state: StateOf<C>;
    props: PropsOf<C>;
    self: C;
};
export declare type SubstituteFunction<C extends AlpineComponent = AlpineComponent> = (args: SubstituteArgs<C>) => string;
export declare type Template<C extends AlpineComponent> = string | SubstituteFunction<C>;
export declare type Styles<C extends AlpineComponent> = string | SubstituteFunction<C>;
export declare type Substitute = string | number | boolean;
export declare type TemplateSubstitute<C extends AlpineComponent> = Substitute | AlpineComponent | ((args: SubstituteArgs<C>) => AlpineComponent | Substitute);
export declare type StylesSubstitute<C extends AlpineComponent> = Substitute | ((args: SubstituteArgs<C>) => Substitute);
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
