import { AlpineComponent } from './Component';
export declare type State = Record<string, any>;
export declare type Props = Record<string, ReturnType<Type> | undefined | null>;
export declare type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
    state?: StateOf<C>;
    propTypes?: Partial<PropTypes<keyof PropsOf<C>>>;
};
export declare enum Mod {
    Required = 0,
    Default = 1
}
export declare type PropsOf<C> = C extends AlpineComponent<State, infer P> ? P : never;
export declare type StateOf<C> = C extends AlpineComponent<infer S> ? S : never;
export declare type TemplateArgs<C extends AlpineComponent> = {
    state: StateOf<C>;
    props: PropsOf<C>;
    self: C;
};
export declare type TemplateFunction<C extends AlpineComponent = AlpineComponent> = (args: TemplateArgs<C>) => string;
export declare type Template<C extends AlpineComponent> = string | TemplateFunction<C>;
export declare type Substitute<C extends AlpineComponent> = string | number | boolean | AlpineComponent | ((args: TemplateArgs<C>) => AlpineComponent | string);
export declare type Type = StringConstructor | NumberConstructor | BooleanConstructor | FunctionConstructor | ArrayConstructor;
export declare type PropType<T extends Type = Type> = T | [T, Mod, ReturnType<T>?];
export declare type PropTypes<K extends PropertyKey = string> = Record<K, PropType>;
