import { AlpineComponent } from './Component';
import { StylesSubstitute, SubstituteArgs, TemplateSubstitute } from './types';
import { templateSymbol } from './constants';

export abstract class Processor<C extends AlpineComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}

export class HtmlProcessor<C extends AlpineComponent> extends Processor<C> {
  constructor(
    private strings: string[],
    private substitutes: TemplateSubstitute<C>[],
  ) {
    super();
  }

  process(args: SubstituteArgs<C>) {
    return this.strings.reduce((html, string, index) => {
      let substitute = this.substitutes[index] ?? '';
      if (typeof substitute === 'function') {
        substitute = substitute(args);
      }
      if (substitute instanceof AlpineComponent) {
        substitute.parent = args.self;
        string += substitute[templateSymbol]()
      } else {
        string += String(substitute);
      }
      return html + string;
    }, '');
  }
}

export class CssProcessor<C extends AlpineComponent> extends Processor<C> {
  constructor(
    private strings: string[],
    private substitutes: StylesSubstitute<C>[],
  ) {
    super();
  }

  process(args: SubstituteArgs<C>): string {
    return this.strings.reduce((css, string, index) => {
      let substitute = this.substitutes[index] ?? '';
      if (typeof substitute === 'function') {
        substitute = substitute(args);
      }
      string += substitute instanceof AlpineComponent
        ? substitute.selector
        : String(substitute)
      return css + string;
    }, '');
  }
}
