import { AyceComponent } from './Component';
import { StylesSubstitute, Substitute, SubstituteArgs, TemplateSubstitute } from './types';
import { templateSymbol } from './constants';

export abstract class Processor<C extends AyceComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}

const ensureArray = (
  substitute: Substitute | Substitute[] | AyceComponent<any, any> | AyceComponent<any, any>[],
): [(Substitute | AyceComponent<any, any>)] | AyceComponent<any, any>[] | Substitute[] => {
  return Array.isArray(substitute) ? substitute : [substitute];
}


export class HtmlProcessor<C extends AyceComponent> extends Processor<C> {
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
        if (item instanceof AyceComponent) {
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

export class CssProcessor<C extends AyceComponent> extends Processor<C> {
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
      string += substitute instanceof AyceComponent
        ? substitute.selector
        : String(substitute)
      return css + string;
    }, '');
  }
}
