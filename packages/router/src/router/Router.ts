import { RouteChangeCallback } from '../types';

export abstract class Router {
  abstract onRouteChange(callback: RouteChangeCallback): () => void;
}
