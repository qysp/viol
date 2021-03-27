# Viol

Viol is a lightweight framework for [Alpine.js](https://github.com/alpinejs/alpine).

> Take everything with a grain of salt, this is just a fun project and not meant to be used in production (yet?).

## Install

Run `npm install --save-dev @viol/core` or `yarn add -D @viol/core` depending on your package manager.

## Features

### Magic `onInit` and `onAfterInit` methods

These methods will automatically be called and don't need to (and also shouldn't) be added to the component using `x-init="onInit()" or x-init="() => { onAfterInit() }"`.

### Scoped CSS

Using the `css` tag you can use the component's selector and therefore make the styles only apply for HTML that is part of that specific component.

<details>

  <summary>A simple example:</summary>

  Using `${self}` here is just syntactic sugar for `${self.selector}`.
  The selector is just a simple property that holds the selector string.

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
  class ColorExample extends ViolComponent<{}, { color: string }> { }

  @Component<App>({
    template: html`
      ${new ColorExample({ color: 'red' })}
      ${new ColorExample({ color: 'blue' })}
    `,
  })
  class App extends ViolComponent { }

  createApp(new App(), document.getElementById('root')!);
  ```

</details>

### `onDestroy` method

This method will be automatically called if the component __was__ destroyed (i.e. removed from the DOM).

In order for Viol to detect its removal from the DOM, you need to set the `emitOnDestroy` option.
This utilizes the MutationObserver which might have a negative impact on the performance of your app.

<details>

  <summary>How to use:</summary>

  ```ts
  @Component<SimpleComponent>({
    template: ({ props }) => `
      <p>Hello ${props.thing}!</p>
    `,
  })
  class SimpleComponent extends ViolComponent<{}, { thing: string }> {
    onDestroy() {
      console.log(`The ${this.props.thing} was destroyed!`);
    }
  }

  @Component<App>({
    template: html`
      <div>
        <template x-if="state.condition">
          ${new SimpleComponent({ thing: 'World' })}
        </template>
        <template x-if="!state.condition">
          ${new SimpleComponent({ thing: 'Universe' })}
        </template>
      </div>
    `,
    state: {
      condition: true,
    },
  })
  class App extends ViolComponent<{ condition: boolean }> {
    private id!: NodeJS.Timeout;

    onInit() {
      this.id = setInterval(() => this.state.condition = !this.state.condition, 3000);
    }

    onDestroy() {
      clearInterval(this.id);
    }
  }

  createApp(new App(), document.getElementById('root')!, {
    emitOnDestroy: true, // this must be set to true!
  });
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

Viol comes with an awesome custom management system for your component's state. It allows you to use deeply nested objects and arrays and reliably update the affected components.

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
  export class Counter extends ViolComponent<{
    intervalId: null | NodeJS.Timeout;
    time: number;
  }> {
    onDestroy() {
      this.reset();
    }

    onClick(): void {
      if (this.state.intervalId !== null) {
        this.stop();
        return;
      } else if (this.state.time === 0) {
        this.reset();
      }
      this.start();
    }

    start(): void {
      --this.state.time;
      this.state.intervalId = setInterval(() => {
        --this.state.time;
        if (this.state.time === 0) {
          this.stop();
        }
      }, 1000);
    }

    stop(): void {
      if (this.state.intervalId !== null) {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
      }
    }

    reset(): void {
      this.stop();
      this.state.time = 20;
    }
  }

  createApp(new Counter(), document.getElementById('root')!, {
    emitOnDestroy: true,
  });
  ```

</details>

## Examples

Checkout [Viol Examples](https://github.com/qysp/viol-examples) for a demo.
