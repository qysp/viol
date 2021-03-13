import { AyceComponent } from './Component';
import { ComponentDef, StylesSubstitute, TemplateSubstitute } from './types';
import { CssProcessor, HtmlProcessor } from './processors';
export declare function Component<C extends AyceComponent>(def: ComponentDef<C>): ClassDecorator;
export declare const html: <C extends AyceComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: TemplateSubstitute<C>[]) => HtmlProcessor<C>;
export declare const css: <C extends AyceComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: StylesSubstitute<C>[]) => CssProcessor<C>;
export declare const getComponent: (name: string) => AyceComponent<any, any> | null;
export declare const createApp: <C extends AyceComponent<{}, {}>>(component: C, root: HTMLElement) => void;
