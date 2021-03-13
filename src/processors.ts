import { AlpineComponent } from './Component';
import { StylesSubstitute, Substitute, SubstituteArgs, TemplateSubstitute } from './types';
import { templateSymbol } from './constants';

export abstract class Processor<C extends AlpineComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}

const ensureArray = (
  substitute: Substitute | Substitute[] | AlpineComponent | AlpineComponent[],
): [(Substitute | AlpineComponent)] | AlpineComponent[] | Substitute[] => {
  return Array.isArray(substitute) ? substitute : [substitute];
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
      for (const item of ensureArray(substitute)) {
        if (item instanceof AlpineComponent) {
          item.parent = args.self;
          string += item[templateSymbol]()
        } else {
          string += String(item);
        }
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
