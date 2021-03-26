import { ViolComponent } from '../../Component';
import { StylesSubstitute, SubstituteArgs } from '../../types';
import { Processor } from './Processor';

export class CSSProcessor<C extends ViolComponent> extends Processor<C> {
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

  private processSubstitute(
    substitute: StylesSubstitute<C>,
    args: SubstituteArgs<C>,
  ) {
    if (typeof substitute === 'function') {
      substitute = substitute(args);
    }
    return substitute instanceof ViolComponent
      ? substitute.selector
      : String(substitute)
  }
}
