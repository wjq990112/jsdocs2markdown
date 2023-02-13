import { parser as compParser } from './comp';
// import { parser as funcParser } from './func';
export * from './comp';
// export * from './func';

export default function parser(source: string) {
  return compParser(source);
}
