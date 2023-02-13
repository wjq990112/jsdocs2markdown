import { type ParserResult, type Prop, type Method } from './types';
import {
  type SourceFile,
  type ExportedDeclarations,
  Project,
  SyntaxKind,
} from 'ts-morph';

export function getFunctionDecl(ast: SourceFile, functionName: string) {
  // `const Foo = () => {}`
  // `const Foo = function () {}`
  const variableDeclaration = ast.getVariableDeclaration(functionName);
  const isArrowFunction = variableDeclaration?.getFirstChildByKind(
    SyntaxKind.ArrowFunction
  );
  const isAnonymousFunction = variableDeclaration?.getFirstChildByKind(
    SyntaxKind.FunctionExpression
  );
  // `function Foo() {}`
  const functionDeclaration = ast.getFunction(functionName);
  const isNamedFunction = Boolean(functionDeclaration);

  if (!isArrowFunction && !isAnonymousFunction && !isNamedFunction) {
    return;
  }

  return functionName;
}

export function getComponentName(ast: SourceFile, exportedName: string) {
  const exportedDeclarationsMap = ast.getExportedDeclarations();

  // not existed
  if (!exportedDeclarationsMap.has(exportedName)) {
    return;
  }

  // `export function Foo() {}` or `export const Foo = () => {}`
  const exportedDeclarations = exportedDeclarationsMap.get(
    exportedName
  ) as ExportedDeclarations[];

  // multi export
  if (exportedDeclarations.length > 1) {
    return;
  }

  // `Foo`
  const [exportedDeclaration] = exportedDeclarations;
  // do not support anonymous function
  const identifier = exportedDeclaration.getFirstChildByKindOrThrow(
    SyntaxKind.Identifier
  );
  const componentName = identifier.getText();

  return getFunctionDecl(ast, componentName);
}

export function getComponentPropsAndMethods(
  ast: SourceFile,
  componentName: string
) {
  const props: Prop[] = [];
  const methods: Method[] = [];

  if (!getFunctionDecl(ast, componentName)) {
    return [props, methods];
  }

  // `const Foo = () => {}`
  // `const Foo = function () {}`
  const variableDeclaration = ast.getVariableDeclaration(componentName);

  if (variableDeclaration) {
    const decl = variableDeclaration;
    // `const Foo = (props: Props) => {}` => `props: Props`
    // TODO
  }

  // `function Foo() {}`
  const functionDeclaration = ast.getFunction(componentName);

  if (functionDeclaration) {
    const decl = functionDeclaration;
    // `function Foo(props: Props) {}` => `props: Props`
    const param = decl.getFirstChildByKind(SyntaxKind.Parameter);
    // `function Foo(props: Props) {}` => `Props`
    const type = param?.getType();
    // get all properties in type
    type?.getProperties().forEach((symbol) => {
      const p = symbol.getValueDeclarationOrThrow();
      const propIdentifier = p.getFirstChildByKindOrThrow(
        SyntaxKind.Identifier
      );
      const propType = propIdentifier.getType();
      if (p.isKind(SyntaxKind.PropertySignature)) {
        const name = propIdentifier.getText();
        const type = propType.getText();
        const required = !p.hasQuestionToken();

        if (propType.isObject()) {
          // methods
          const [signature] = propType.getCallSignatures();
          const type = signature.getDeclaration();

          //? Is this the best way to judge a function type?
          if (!type.isKind(SyntaxKind.FunctionType)) {
            return;
          }

          const params = type
            .getParameters()
            .map((p) => p.getText())
            .join('\n');
          const returns = type.getReturnType().getText();

          methods.push({
            name,
            params,
            returns,
            required,
          });
        } else {
          // properties
          props.push({
            name,
            type,
            required,
          });
        }
      } else if (p.isKind(SyntaxKind.MethodSignature)) {
        const name = propIdentifier.getText();
        const [signature] = propType.getCallSignatures();
        const type = signature.getDeclaration();
        const typeSignature = type.getSignature();
        const params = typeSignature
          .getParameters()
          .map((p) => {
            const param = p.getValueDeclarationOrThrow();
            return param.getText();
          })
          .join('\n');
        const returns = typeSignature.getReturnType().getText();
        const required = !p.hasQuestionToken();

        methods.push({
          name,
          params,
          returns,
          required,
        });
      }
    });
    return [props, methods];
  }

  return [props, methods];
}

export function parser(source: string) {
  const p = new Project();
  const ast = p.createSourceFile('.temp.tsx', source);
  const ret: ParserResult = {};

  const exports = ast.getExportedDeclarations();
  exports.forEach((_, k) => {
    const componentName = getComponentName(ast, k) as string;
    const [componentProps, componentMethods] = getComponentPropsAndMethods(
      ast,
      componentName
    );
    Object.assign(ret, {
      [k]: {
        name: componentName,
        props: componentProps,
        methods: componentMethods,
      },
    });
  });

  return ret;
}
