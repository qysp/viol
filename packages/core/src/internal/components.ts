import { ViolComponent } from '../Component';
import { Styles, SubstituteArgs, Template } from '../types';
import { createFragment } from './util';

const process = <C extends ViolComponent>(
  subject: Styles<C> | Template<C>,
  args: SubstituteArgs<C>,
): string => {
  if (typeof subject === 'function') {
    subject = subject(args);
  }
  if (typeof subject === 'string') {
    return subject;
  }
  return subject.process(args)
}

export const processTemplate = <C extends ViolComponent>(
  template: Template<C>,
  args: SubstituteArgs<C>,
): string => {
  const html = process(template, args);
  const fragment = createFragment(html);
  const root = fragment.firstElementChild;
  if (root !== null) {
    // Make this component queryable for CSS selectors.
    root.setAttribute('x-name', args.self.name);
    // Register component for Alpine.
    root.setAttribute('x-data', `ViolComponents.get('${args.self.name}')`);
  }
  return Array.from(fragment.children).reduce((markup, child) => {
    return markup + child.outerHTML;
  }, '');
};

export const processStyles = <C extends ViolComponent>(
  styles: Styles<C> | undefined,
  args: SubstituteArgs<C>,
): string => {
  if (styles === undefined) {
    return '';
  }
  return process(styles, args);
};

export const processComponent = <C extends ViolComponent>(
  component: C,
): string => {
  const args: SubstituteArgs<C> = {
    props: component.props,
    state: component.state,
    self: component,
  };
  const html = processTemplate(component.template, args);
  const css = processStyles(component.styles, args);
  window.ViolStyles.push(css);
  return html;
};
