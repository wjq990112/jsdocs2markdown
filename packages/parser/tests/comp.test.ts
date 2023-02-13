import { join } from 'node:path';
import read from './read';
import parser from '@';
import { type ParserResult, type Prop } from '@/types';

function readComp(path: string) {
  return read(join('./components', path));
}

describe('components with nothing', () => {
  it('should get component name from FunctionDeclaration', () => {
    const source = readComp('FunctionDeclaration.tsx');
    expect(parser(source)).toMatchSnapshot();
  });

  it('should get component name from VariableDeclaration', () => {
    const source = readComp('VariableDeclaration.tsx');
    expect(parser(source)).toMatchSnapshot();
  });
});

describe('components with props', () => {
  it('should get component props from FunctionDeclaration', () => {
    const source = readComp('FunctionDeclarationWithProps.tsx');
    expect(parser(source)).toMatchSnapshot();
  });
});
