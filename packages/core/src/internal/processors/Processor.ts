import { ViolComponent } from '../../Component';
import { SubstituteArgs } from '../../types';

export abstract class Processor<C extends ViolComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}
