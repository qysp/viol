declare abstract class Processor<C extends AyceComponent> {
    abstract process(args: SubstituteArgs<C>): string;
}
declare class HtmlProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: TemplateSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}
declare class CssProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: StylesSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
}

declare type IsEmpty<T, Y = true, N = false> = T extends {
    [key: string]: never;
} ? Y : N;
declare type PropsOf<C> = C extends AyceComponent<State, infer P> ? P : never;
declare type StateOf<C> = C extends AyceComponent<infer S, Props> ? S : never;
declare type State = Record<string, any>;
declare type Props = Record<string, any>;
declare type ComponentDef<C extends AyceComponent> = {
    template: Template<C>;
    styles?: Styles<C>;
} & IsEmpty<StateOf<C>, {
    state?: StateOf<C>;
}, {
    state: StateOf<C>;
}>;
declare type SubstituteArgs<C extends AyceComponent> = {
    state: StateOf<C>;
    props: PropsOf<C>;
    self: C;
};
declare type TemplateFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | HtmlProcessor<C>;
declare type StylesFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | CssProcessor<C>;
declare type Template<C extends AyceComponent> = string | HtmlProcessor<C> | TemplateFunction<C>;
declare type Styles<C extends AyceComponent> = string | CssProcessor<C> | StylesFunction<C>;
declare type Substitute = string | number | boolean;
declare type TemplateSubstitute<C extends AyceComponent> = Substitute | Substitute[] | AyceComponent<any, any> | AyceComponent<any, any>[] | ((args: SubstituteArgs<C>) => AyceComponent<any, any> | Substitute);
declare type StylesSubstitute<C extends AyceComponent> = Substitute | C | ((args: SubstituteArgs<C>) => C | Substitute);
interface AlpineComponent<E extends HTMLElement, C extends AyceComponent> {
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
interface AlpineElement<E extends HTMLElement, C extends AyceComponent> {
    __x: AlpineComponent<E, C>;
    __x_original_classes?: string[];
    __x_is_shown?: boolean;
    __x_inserted_me?: boolean;
    __x_for_key?: string;
}
interface Alpine {
    onBeforeComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
    onComponentInitialized: (callback: (component: AlpineComponent<any, any>) => void) => void;
}

declare const templateSymbol: unique symbol;

declare global {
    interface Window {
        Alpine: Alpine;
        AyceComponents: Map<string, AyceComponent<any, any>>;
        deferLoadingAlpine?: (callback: Function) => any;
    }
}
interface AyceComponent<S extends State, P extends Props> {
    template: Template<AyceComponent<any, any>>;
    styles?: Styles<AyceComponent<any, any>>;
    state: S;
    props: P;
    parent?: AyceComponent<any, any>;
    readonly $el: AlpineElement<HTMLElement, this>;
    readonly $nextTick: (callback: () => void) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: (value: unknown) => void) => void;
    onInit?(): void;
    onAfterInit?(): void;
    [templateSymbol](): string;
}
declare class AyceComponent<S extends State = {}, P extends Props = {}> {
    readonly name: string;
    readonly selector: string;
    constructor(props?: P, name?: string);
}

declare function Component<C extends AyceComponent>(def: ComponentDef<C>): ClassDecorator;
declare const html: <C extends AyceComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: TemplateSubstitute<C>[]) => HtmlProcessor<C>;
declare const css: <C extends AyceComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: StylesSubstitute<C>[]) => CssProcessor<C>;
declare const getComponent: (name: string) => AyceComponent<any, any> | null;
declare const createApp: <C extends AyceComponent<{}, {}>>(component: C, root: HTMLElement) => void;

export { Alpine, AlpineComponent, AlpineElement, AyceComponent, Component, ComponentDef, Props, State, Styles, StylesFunction, StylesSubstitute, Substitute, SubstituteArgs, Template, TemplateFunction, TemplateSubstitute, createApp, css, getComponent, html };
