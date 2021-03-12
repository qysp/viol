import { Props, State, Template } from './types';
declare global {
    interface Window {
        AlpineComponents: Record<string, AlpineComponent>;
        deferLoadingAlpine?: (callback: Function) => any;
    }
}
interface AlpineElement<E extends HTMLElement, S extends State, P extends Props> {
    __x: {
        $data: AlpineComponent<S, P>;
        $el: AlpineElement<E, S, P>;
        membrane: Object;
        nextTickStack: any[];
        showDirectiveLastElement?: E;
        showDirectiveStack: any[];
        unobservedData: AlpineComponent<S, P>;
        watchers: Record<string, Function[]>;
        updateElement(el: HTMLElement, extraVars?: () => any): void;
        updateElements(rootEl: HTMLElement, extraVars?: () => any): void;
    };
}
export declare class AlpineComponent<S extends State = {}, P extends Props = {}> {
    readonly name: string;
    template: Template<AlpineComponent>;
    state: S;
    props: P;
    parent?: AlpineComponent;
    readonly $el: AlpineElement<HTMLElement, S, P>;
    readonly $nextTick: (callback: Function) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: Function) => void;
    constructor(props?: P, name?: string);
    __getTemplate(): string;
}
export {};
