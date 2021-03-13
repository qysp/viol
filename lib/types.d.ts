import { AyceComponent } from './Component';
import { CssProcessor, HtmlProcessor } from './processors';
export declare type IsEmpty<T, Y = true, N = false> = T extends {
    [key: string]: never;
} ? Y : N;
export declare type State = Record<string, any>;
export declare type Props = Record<string, any>;
export declare type ComponentDef<C extends AyceComponent> = {
    template: Template<C>;
    styles?: Styles<C>;
} & IsEmpty<StateOf<C>, {
    state?: StateOf<C>;
}, {
    state: StateOf<C>;
}>;
export declare type PropsOf<C> = C extends AyceComponent<State, infer P> ? P : never;
export declare type StateOf<C> = C extends AyceComponent<infer S, Props> ? S : never;
export declare type SubstituteArgs<C extends AyceComponent> = {
    state: StateOf<C>;
    props: PropsOf<C>;
    self: C;
};
export declare type TemplateFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | HtmlProcessor<C>;
export declare type StylesFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | CssProcessor<C>;
export declare type Template<C extends AyceComponent> = string | HtmlProcessor<C> | TemplateFunction<C>;
export declare type Styles<C extends AyceComponent> = string | CssProcessor<C> | StylesFunction<C>;
export declare type Substitute = string | number | boolean;
export declare type TemplateSubstitute<C extends AyceComponent> = Substitute | Substitute[] | AyceComponent<any, any> | AyceComponent<any, any>[] | ((args: SubstituteArgs<C>) => AyceComponent<any, any> | Substitute);
export declare type StylesSubstitute<C extends AyceComponent> = Substitute | C | ((args: SubstituteArgs<C>) => C | Substitute);
export interface AlpineComponent<E extends HTMLElement, C extends AyceComponent> {
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
}
export interface AlpineElement<E extends HTMLElement, C extends AyceComponent> {
    __x: AlpineComponent<E, C>;
    __x_original_classes?: string[];
    __x_is_shown?: boolean;
    __x_inserted_me?: boolean;
    __x_for_key?: string;
}
export interface Alpine {
    onBeforeComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
    onComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
}
