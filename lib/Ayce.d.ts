import { AlpineComponent } from './Component';
import { ComponentDef, SubstituteFunction, TemplateSubstitute, StylesSubstitute } from './types';
export declare function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator;
export declare const html: <C extends AlpineComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: TemplateSubstitute<C>[]) => SubstituteFunction<C>;
export declare const css: <C extends AlpineComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: StylesSubstitute<C>[]) => SubstituteFunction<C>;
export declare const getComponent: (name: string) => AlpineComponent | null;
export declare const createApp: <C extends AlpineComponent<{}, {}>>(component: C, root: HTMLElement) => void;
