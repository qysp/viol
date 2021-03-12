import { AlpineElement, Props, State, Template } from './types';
import { templateSymbol } from './constants';
declare global {
    interface Window {
        AlpineComponents: Record<string, AlpineComponent>;
        deferLoadingAlpine?: (callback: Function) => any;
    }
}
export declare class AlpineComponent<S extends State = {}, P extends Props = {}> {
    readonly name: string;
    template: Template<AlpineComponent>;
    state: S;
    props: P;
    parent?: AlpineComponent;
    readonly $el: AlpineElement<HTMLElement, this>;
    readonly $nextTick: (callback: () => void) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: (value: unknown) => void) => void;
    constructor(props?: P, name?: string);
    protected onInit(): void | (() => void);
    protected onAfterInit(): void;
    [templateSymbol](): string;
}
