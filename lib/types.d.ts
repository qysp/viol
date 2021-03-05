import { AlpineComponent } from "./Component";
export declare type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
    state?: State;
    propTypes?: PropTypes;
};
export declare enum Mod {
    Required = 0,
    Default = 1
}
export declare type CreateComponentProps<C extends AlpineComponent> = {
    state: State;
    props: Props;
    self: C;
};
export declare type TemplateFunction<C extends AlpineComponent = AlpineComponent> = (options: CreateComponentProps<C>) => string;
export declare type Template<C extends AlpineComponent> = string | TemplateFunction<C>;
export declare type State = Record<string, any>;
export declare type Type = StringConstructor | NumberConstructor | BooleanConstructor | FunctionConstructor | ArrayConstructor;
export declare type PropType<T extends Type = Type> = T | [T, Mod, ReturnType<T>?];
export declare type PropTypes = Record<string, PropType>;
export declare type Props = Record<string, ReturnType<Type> | undefined | null>;
