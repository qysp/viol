import { AyceComponent } from './Component';

if (!('AyceComponents' in window)) {
  window.AyceComponents = new Map<string, AyceComponent<any, any>>();
}

export * from './public-api';
