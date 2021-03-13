import { AlpineComponent } from './Component';

if (!('AlpineComponents' in window)) {
  window.AlpineComponents = new Map<string, AlpineComponent>();
}

export * from './public-api';
