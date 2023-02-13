import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default function read(path: string) {
  const resolvedPath = resolve('tests', path);

  return readFileSync(resolvedPath, {
    encoding: 'utf-8',
  });
}
