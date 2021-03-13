import { Alpine, AlpineElement, Props, State, Styles, Template } from './types';
import { templateSymbol } from './constants';
declare global {
    interface Window {
        Alpine: Alpine;
        AyceComponents: Map<string, AyceComponent<any, any>>;
        deferLoadingAlpine?: (callback: Function) => any;
    }
}
export declare class AyceComponent<S extends State = {}, P extends Props = {}> {
    readonly name: string;
    readonly selector: string;
    template: Template<AyceComponent<any, any>>;
    styles?: Styles<AyceComponent<any, any>>;
    state: S;
    props: P;
    parent?: AyceComponent<any, any>;
    readonly $el: AlpineElement<HTMLElement, this>;
    readonly $nextTick: (callback: () => void) => void;
    readonly $refs: Record<string, HTMLElement>;
    readonly $watch: (property: string, callback: (value: unknown) => void) => void;
    constructor(props?: P, name?: string);
    [templateSymbol](): string;
}
export interface AyceComponent {
    onInit?(): void;
    onAfterInit?(): void;
}
