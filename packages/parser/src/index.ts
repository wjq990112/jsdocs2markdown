import { parser as componentParser } from './comp';
import { parser as functionParser } from './func';

export default function parser(source: string) {
  return componentParser(source);
}

export { parser as componentParser } from './comp';
export { parser as functionParser } from './func';
