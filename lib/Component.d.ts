import { Props, PropTypes, State, Template } from './types';
declare global {
    interface Window {
        AlpineComponents: Record<string, AlpineComponent<State, Props>>;
        deferLoadingAlpine?: (callback: Function) => any;
    }
}
interface AlpineElement<E extends HTMLElement, S extends State, P extends Props> {
    __x: {
        $data: AlpineComponent<S, P>;
        $el: E;
        membrane: Object;
        nextTickStack: any[];
        showDirectiveLastElement?: E | HTMLElement;
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
    propTypes?: PropTypes;
    readonly $el: AlpineElement<HTMLElement, S, P>;
    readonly $nextTick: (callback: Function) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: Function) => void;
    constructor(props?: P);
    __getTemplate(): string;
}
export {};
