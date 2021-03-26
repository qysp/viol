import { RouteChangeCallback, RouterLink } from '../types';
import { Router } from './Router';

const listeners = new Set<RouteChangeCallback>();

class SyntheticRouter extends Router {
  currentRoute: string = '';

  onRouteChange(callback: RouteChangeCallback): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }

  changeRoute(route: string): void {
    this.currentRoute = route;
    for (const listener of listeners) {
      listener(route);
    }
  }
}

export const syntheticRouter = new SyntheticRouter();

export const useSyntheticRouter = (): void => {
  const alpine: (callback: Function) => void = window.deferLoadingAlpine ?? ((cb) => cb());
  window.deferLoadingAlpine = (callback: Function) => {
    alpine(callback);
    window.Alpine.onBeforeComponentInitialized((component) => {
      const routerLink = (component.$data as Partial<RouterLink>).routerLink
        ?? component.$el?.getAttribute('x-router-link');
      if (routerLink !== null && component.$el !== undefined) {
        component.$el.addEventListener('click', () => syntheticRouter.changeRoute(routerLink));
      }
    });
  };
}
