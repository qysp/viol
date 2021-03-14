# Ayce

Ayce is a lightweight framework for [Alpine.js](https://github.com/alpinejs/alpine).

> Take everything with a grain of salt, this is just a fun project and not meant to be used in production (yet?).

## Features

### Magic `onInit` and `onAfterInit` methods

These methods will automatically be called and don't need to (and also shouldn't) be added to the component using `x-init="onInit()" or x-init="() => { onAfterInit() }"`.

### Scoped CSS

Using the `css` tag you can use the component's selector and therefore make the styles only apply for HTML that is part of that specific component.

<details>

  <summary>A simple example:</summary>

  ```ts
  @Component<ColorExample>({
    template: `
      <p x-text="'Look at me, I am ' + props.color"><p>
    `,
    styles: ({ self, props }) => css`
      ${self} {
        color: ${props.color};
      }
    `,
  })
  class ColorExample extends AyceComponent<{}, { color: string }> { }

  @Component({
    template: html`
      ${new ColorExample({ color: 'red' })}
      ${new ColorExample({ color: 'blue' })}
    `,
  })
  class App extends AyceComponent { }

  createApp(new App(), document.getElementById('root')!);
  ```

</details>

### Native `parent` property

If your component is not the root component which is rendered into the DOM using `createApp`, you will have a `parent` property in your component that will return the parent component in which this instance is rendered in.

> Note: this property is not assigned until `createApp` is called, and the templates are processed.

### Utility function to access other components

The standalone utility function `getComponent` will give you native access to a component anywhere in the DOM.
To make use of it, give the component you wish to access a name in its constructor like so `new App({ some: 'props'}, 'MyAwesomeApp'}` and access it from other components with `getComponent('MyAwesomeApp')`.

> Note: this function will return `null` if the name was not found.

### Custom state management system

Ayce comes with an awesome custom management system for your component's state. It allows you to use deeply nested objects and arrays and reliably update the affected components.

Okay, just kidding. This _feature_ will hopefully be removed in the future.

<details>

  <summary>Still, here is an example:</summary>

  ```ts
  @Component<Counter>({
    template: `
      <button x-text="state.time" @click="onClick()"></button>
    `,
    state: {
      intervalId: null,
      time: 20,
    },
  })
  export class Counter extends AyceComponent<{
    intervalId: null | number;
    time: number;
  }> {
    onClick() {
      if (this.state.intervalId !== null) {
        this.stop();
      } else if (this.state.time === 0) {
        this.state.time = 20;
      }
      this.start();
    }

    start() {
      --this.state.time;
      this.state.intervalId = setInterval(() => {
        --this.state.time;
        if (this.state.time === 0) {
          this.stop();
        }
      }, 1000);
    }

    stop() {
      if (this.state.intervalId !== null) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }
    }

    reset() {
      this.stop();
      this.state.time = 20;
    }
  }

  createApp(new Counter(), document.getElementById('root')!);
  ```

</details>

## Examples

Checkout [Ayce Examples](https://github.com/qysp/ayce-examples) for a demo.

## TODO

- [ ] Merge all component styles into one `style` element
- [ ] Remove the custom state management system
- [ ] Enhance typing for the `Component` decorator (no more `@Component<MyComponent>()`)
