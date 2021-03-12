import { AlpineComponent } from './Component';
import { ComponentDef, Substitute, TemplateFunction } from './types';
export declare function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator;
export declare const html: <C extends AlpineComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: Substitute<C>[]) => TemplateFunction<C>;
export declare const getComponent: (name: string) => AlpineComponent | null;
export declare const createApp: <C extends AlpineComponent<{}, {}>>(component: C, root: HTMLElement) => void;
