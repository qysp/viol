'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@viol/core');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.RouterOutlet = class RouterOutlet extends core.ViolComponent {
    onInit() {
        this.props.router.onRouteChange((route) => {
            this.route = route;
        });
    }
    matchesRoute(route) {
        return this.route === route;
    }
    get route() {
        return this.state.currentRoute;
    }
    set route(route) {
        var _a, _b;
        (_b = (_a = this.props).onRouteChange) === null || _b === void 0 ? void 0 : _b.call(_a, route);
        this.state.currentRoute = route;
    }
};
exports.RouterOutlet = __decorate([
    core.Component({
        template: ({ props }) => core.html `
    <div>
      ${props.routes.map((route) => {
            var _a;
            return core.html `
        <template x-if="matchesRoute('${route.path}')">
          ${(_a = route.component) !== null && _a !== void 0 ? _a : route.template}
        </template>
      `;
        })}
    <div>
  `,
        state: {
            currentRoute: '',
        },
    })
], exports.RouterOutlet);

class Router {
}

const listeners = new Set();
class SyntheticRouter extends Router {
    constructor() {
        super(...arguments);
        this.currentRoute = '';
    }
    onRouteChange(callback) {
        listeners.add(callback);
        return () => {
            listeners.delete(callback);
        };
    }
    changeRoute(route) {
        this.currentRoute = route;
        for (const listener of listeners) {
            listener(route);
        }
    }
}
const syntheticRouter = new SyntheticRouter();
const useSyntheticRouter = () => {
    var _a;
    const alpine = (_a = window.deferLoadingAlpine) !== null && _a !== void 0 ? _a : ((cb) => cb());
    window.deferLoadingAlpine = (callback) => {
        alpine(callback);
        window.Alpine.onBeforeComponentInitialized((component) => {
            var _a, _b;
            const routerLink = (_a = component.$data.routerLink) !== null && _a !== void 0 ? _a : (_b = component.$el) === null || _b === void 0 ? void 0 : _b.getAttribute('x-router-link');
            if (routerLink !== null && component.$el !== undefined) {
                component.$el.addEventListener('click', () => syntheticRouter.changeRoute(routerLink));
            }
        });
    };
};

exports.Router = Router;
exports.syntheticRouter = syntheticRouter;
exports.useSyntheticRouter = useSyntheticRouter;
