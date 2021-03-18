import { ViolComponent, Template, SubstituteArgs, TemplateFunction } from '@viol/core';

declare type RouteChangeCallback = (route: string) => void;
declare type Route<C extends ViolComponent> = {
    path: string;
} & ({
    template: Template<C>;
    component?: ((args: SubstituteArgs<C>) => ViolComponent) | ViolComponent;
} | {
    template?: string | TemplateFunction<C>;
    component: ((args: SubstituteArgs<C>) => ViolComponent) | ViolComponent;
});
interface RouterLink {
    routerLink: string;
}

declare abstract class Router {
    abstract onRouteChange(callback: RouteChangeCallback): () => void;
}

declare class SyntheticRouter extends Router {
    currentRoute: string;
    onRouteChange(callback: RouteChangeCallback): () => void;
    changeRoute(route: string): void;
}
declare const syntheticRouter: SyntheticRouter;
declare const useSyntheticRouter: () => void;

declare type RouterOutletState = {
    currentRoute: string;
};
declare type RouterOutletProps = {
    router: Router;
    routes: Route<any>[];
    onRouteChange?: (route: string) => void;
};
declare class RouterOutlet extends ViolComponent<RouterOutletState, RouterOutletProps> {
    onInit(): void;
    matchesRoute(route: string): boolean;
    get route(): string;
    set route(route: string);
}

export { Route, RouteChangeCallback, Router, RouterLink, RouterOutlet, syntheticRouter, useSyntheticRouter };
