declare abstract class Processor<C extends AyceComponent> {
    abstract process(args: SubstituteArgs<C>): string;
}

declare class CSSProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: StylesSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
    private processSubstitute;
}

declare class HTMLProcessor<C extends AyceComponent> extends Processor<C> {
    private strings;
    private substitutes;
    constructor(strings: string[], substitutes: TemplateSubstitute<C>[]);
    process(args: SubstituteArgs<C>): string;
    private processSubstitute;
    private ensureArray;
}

declare global {
    interface Window {
        Alpine: Alpine;
        AyceComponents: Map<string, AyceComponent>;
        AyceStyles: string[];
        deferLoadingAlpine?: (callback: Function) => any;
    }
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
declare type TemplateFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | HTMLProcessor<C>;
declare type StylesFunction<C extends AyceComponent> = (args: SubstituteArgs<C>) => string | CSSProcessor<C>;
declare type Template<C extends AyceComponent> = string | HTMLProcessor<C> | TemplateFunction<C>;
declare type Styles<C extends AyceComponent> = string | CSSProcessor<C> | StylesFunction<C>;
declare type Substitute = string | number | boolean;
declare type TemplateSubstituteValue<C extends AyceComponent> = Substitute | AyceComponent | HTMLProcessor<C>;
declare type TemplateSubstituteFunction<C extends AyceComponent> = ((args: SubstituteArgs<C>) => TemplateSubstituteValue<C> | TemplateSubstituteValue<C>[]);
declare type TemplateSubstitute<C extends AyceComponent> = TemplateSubstituteFunction<C> | TemplateSubstituteValue<C> | TemplateSubstituteValue<C>[];
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
interface AlpineElement<E extends HTMLElement, C extends AyceComponent> extends HTMLElement {
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

interface AyceComponent<S extends State, P extends Props> {
    template: Template<AyceComponent>;
    styles?: Styles<AyceComponent>;
    state: S;
    props: P;
    parent?: AyceComponent;
    readonly $el?: AlpineElement<HTMLElement, this>;
    readonly $nextTick: (callback: () => void) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: (value: unknown) => void) => void;
    onInit?(): void;
    onAfterInit?(): void;
}
declare class AyceComponent<S extends State = any, P extends Props = any> {
    readonly name: string;
    readonly selector: string;
    constructor(props?: P, name?: string);
}

declare function Component<C extends AyceComponent>(def: ComponentDef<C>): ClassDecorator;
declare const html: <C extends AyceComponent<any, any>>(strings: TemplateStringsArray, ...substitutes: TemplateSubstitute<C>[]) => HTMLProcessor<C>;
declare const css: <C extends AyceComponent<any, any>>(strings: TemplateStringsArray, ...substitutes: StylesSubstitute<C>[]) => CSSProcessor<C>;
declare const getComponent: <C extends AyceComponent<any, any> = AyceComponent<any, any>>(name: string) => C | null;
declare const createApp: <C extends AyceComponent<any, any>>(component: C, root: HTMLElement) => void;

export { Alpine, AlpineComponent, AlpineElement, AyceComponent, Component, ComponentDef, Props, State, Styles, StylesFunction, StylesSubstitute, Substitute, SubstituteArgs, Template, TemplateFunction, TemplateSubstitute, TemplateSubstituteFunction, TemplateSubstituteValue, createApp, css, getComponent, html };
