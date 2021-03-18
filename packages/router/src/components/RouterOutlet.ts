import { ViolComponent, Component, html } from '@viol/core';
import { Router } from '../router';
import { Route } from '../types';

type RouterOutletState = {
  currentRoute: string;
};

type RouterOutletProps = {
  router: Router;
  routes: Route<any>[];
  onRouteChange?: (route: string) => void;
};

@Component<RouterOutlet>({
  template: ({ props }) => html`
    <div>
      ${props.routes.map((route) => html`
        <template x-if="matchesRoute('${route.path}')">
          ${route.component ?? route.template!}
        </template>
      `)}
    <div>
  `,
  state: {
    currentRoute: '',
  },
})
export class RouterOutlet extends ViolComponent<RouterOutletState, RouterOutletProps> {
  onInit() {
    this.props.router.onRouteChange((route) => {
      this.route = route;
    });
  }

  matchesRoute(route: string) {
    return this.route === route;
  }

  get route() {
    return this.state.currentRoute;
  }

  set route(route: string) {
    this.props.onRouteChange?.(route);
    this.state.currentRoute = route;
  }
}
