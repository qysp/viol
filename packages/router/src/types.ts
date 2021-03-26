import { ViolComponent, SubstituteArgs, Template, TemplateFunction } from '@viol/core';

export type RouteChangeCallback = (route: string) => void;

export type Route<C extends ViolComponent> = {
  path: string;
} & ({
  template: Template<C>;
  component?: ((args: SubstituteArgs<C>) => ViolComponent) | ViolComponent;
} | {
  template?: string | TemplateFunction<C>;
  component: ((args: SubstituteArgs<C>) => ViolComponent) | ViolComponent;
});

export interface RouterLink {
  routerLink: string;
}
