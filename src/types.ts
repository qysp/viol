import { AlpineComponent } from "./Component";

export type ComponentDef<C extends AlpineComponent> = {
    template: Template<C>;
    state?: State;
    propTypes?: PropTypes;
};

export enum Mod {
    Required,
    Default,
}

export type CreateComponentProps<C extends AlpineComponent> = {
    state: State;
    props: Props;
    self: C;
};

export type TemplateFunction<C extends AlpineComponent = AlpineComponent> = (options: CreateComponentProps<C>) => string;
export type Template<C extends AlpineComponent> = string | TemplateFunction<C>;

export type State = Record<string, any>;

export type Type = StringConstructor | NumberConstructor | BooleanConstructor | FunctionConstructor | ArrayConstructor;
export type PropType<T extends Type = Type> = T | [T, Mod, ReturnType<T>?];
export type PropTypes = Record<string, PropType>;

export type Props = Record<string, ReturnType<Type> | undefined | null>;