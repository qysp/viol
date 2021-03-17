import { AyceComponent } from '../../Component';
import { SubstituteArgs } from '../../types';

export abstract class Processor<C extends AyceComponent> {
  abstract process(args: SubstituteArgs<C>): string;
}
