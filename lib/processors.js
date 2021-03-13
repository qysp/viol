import { AlpineComponent } from './Component';
import { templateSymbol } from './constants';
export class Processor {
}
const ensureArray = (substitute) => {
    return Array.isArray(substitute) ? substitute : [substitute];
};
export class HtmlProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((html, string, index) => {
            let substitute = this.substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            for (const item of ensureArray(substitute)) {
                if (item instanceof AlpineComponent) {
                    item.parent = args.self;
                    string += item[templateSymbol]();
                }
                else {
                    string += String(item);
                }
            }
            return html + string;
        }, '');
    }
}
export class CssProcessor extends Processor {
    constructor(strings, substitutes) {
        super();
        this.strings = strings;
        this.substitutes = substitutes;
    }
    process(args) {
        return this.strings.reduce((css, string, index) => {
            let substitute = this.substitutes[index] ?? '';
            if (typeof substitute === 'function') {
                substitute = substitute(args);
            }
            string += substitute instanceof AlpineComponent
                ? substitute.selector
                : String(substitute);
            return css + string;
        }, '');
    }
}
