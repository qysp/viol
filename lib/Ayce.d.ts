import { AlpineComponent } from './Component';
import { ComponentDef, CreateComponentProps, PropType, TemplateFunction, Type } from './types';
export declare type Substitute<C extends AlpineComponent> = string | number | boolean | AlpineComponent | ((options: CreateComponentProps<C>) => AlpineComponent);
export declare const required: (type: Type) => PropType;
export declare const withDefault: <T extends Type>(type: T, defaultValue: ReturnType<T>) => PropType;
export declare function Component<C extends AlpineComponent>(def: ComponentDef<C>): ClassDecorator;
export declare const html: <C extends AlpineComponent<{}, {}>>(strings: TemplateStringsArray, ...substitutes: Substitute<C>[]) => TemplateFunction<C>;
export declare const createApp: <C extends AlpineComponent<{}, {}>>(component: C, root: HTMLElement) => void;
