import { AyceComponent } from '../../Component';
import { SubstituteArgs, TemplateSubstitute } from '../../types';
import { processComponent } from '../components';
import { Processor } from './Processor';

export class HTMLProcessor<C extends AyceComponent> extends Processor<C> {
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
        template += processComponent(item);
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
