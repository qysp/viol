import { AyceComponent } from './Component';
import { StylesSubstitute, SubstituteArgs, TemplateSubstitute } from './types';
import { templateSymbol } from './constants';

export abstract class Processor<C extends AyceComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}

export class HtmlProcessor<C extends AyceComponent> extends Processor<C> {
  constructor(
    private strings: string[],
    private substitutes: TemplateSubstitute<C>[],
  ) {
    super();
  }

  process(args: SubstituteArgs<C>): string {
    return this.strings.reduce((html, string, index) => {
      const sub = this.processSubstitute(this.substitutes[index - 1], args);
      return html + sub + string;
    });
  }

  private processSubstitute(substitute: TemplateSubstitute<C>, args: SubstituteArgs<C>): string {
    if (typeof substitute === 'function') {
      substitute = substitute(args);
    }
    return this.ensureArray(substitute).reduce((template: string, item) => {
      if (item instanceof AyceComponent) {
        if (item === args.self) {
          throw new Error('[Ayce] Error: components cannot be used in their own templates (infinite recursion)');
        }
        item.parent = args.self;
        template += item[templateSymbol]();
      } else if (item instanceof Processor) {
        template += item.process(args);
      } else if (typeof item === 'function') {
        template += this.processSubstitute(item, args);
      } else {
        template += String(item);
      }
      return template;
    }, '');
  }

  private ensureArray(
    substitute: TemplateSubstitute<C>,
  ): TemplateSubstitute<C>[] {
    return Array.isArray(substitute) ? substitute : [substitute];
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
      const sub = this.processSubstitute(this.substitutes[index - 1], args);
      return css + sub + string;
    });
  }

  private processSubstitute(substitute: StylesSubstitute<C>, args: SubstituteArgs<C>) {
    if (typeof substitute === 'function') {
      substitute = substitute(args);
    }
    return substitute instanceof AyceComponent
      ? substitute.selector
      : String(substitute)
  }
}
