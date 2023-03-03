# 为什么创建一个这样的工具？

## 背景

开发组件库的过程中不想写文档，但是非常愿意写注释，希望直接通过注释和代码生成文档。

## 可行性分析

组件库的代码结构往往是比较固定的，以单个组件为例，通常是：

```tsx
import { type FC, type MouseEvent } from 'react';

export type ButtonProps = {
  /**
   * @description 是否禁用
   */
  disabled?: boolean;
  /**
   * @description 点击事件
   */
  onClick?(event?: MouseEvent): void;
};

/**
 * Button 按钮
 * @description 用于开始一个即时操作
 */
const Button: FC<ButtonProps> = (props) => {
  return (
    <button type="button" disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  size: 'md',
};

export default Button;
```

即使不写任何注释，从代码中直接能够获取到的信息就包括组件名、props 类型、props 是否必须和 props 的默认值。

虽然代码结构不一定是这样，但基本可以穷举，不能穷举的部分明确注明，允许用户手动修改文档，也同样能够节省大量书写文档的时间。

加上注释就能更加充分地描述组件的 props 和组件本身，与代码结构获取到的信息整合在一起，几乎能将书写文档的事情完全自动化。

## 社区内同类产品

- [`react-docgen`](https://github.com/reactjs/react-docgen)：React 官方社区的工具，对 TypeScript 的支持一般，主要通过解析 PropType 获取 props 类型
- [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript)：`react-docgen` 的升级版，提供了更强大的 TypeScript 支持，但缺乏插件机制，无法自定义输出的模板
- [`ts-document`](https://github.com/PengJiyuan/ts-document#readme)：Arco Design 的同学正在使用的工具，通过非标准 JSDoc/TSDoc 的方式获取需要的信息，没有代码结构分析的能力，无法拿到注释以外的信息
- [`Vuese`](https://github.com/vuese/vuese)：Vue 社区中的组件文档生成工具，通过编译的方式获取代码和注释生成文档，目前来看不支持 Vue 3
- &etc.（待补充）

## 目标

- 使用标准的 JSDoc/TSDoc
- 支持插件自定义输出模板
- 支持多种输出格式（如 HTML/Markdown 等）

## 架构设计

分几个包：

- `@jsxdocgen/cli` 提供 CLI
- `@jsxdocgen/core` 提供核心的插件机制
- `@jsxdocgen/parser` 对代码结构和注释进行解析
- `@jsxdocgen/renderer` 对解析后的 Scheme 进行转换

parser 和 renderer 需要支持插件机制，允许用户自定义输出的 Scheme 和对 Scheme 进行转换。

## 希望用户怎么使用？

### CLI

```bash
jdg ./index.tsx ./README.md
# or
jsxdocgen ./index.tsx ./README.md
```

### Node.js API

```ts
import { readFileSync } from 'node:fs';
import { componentParser } from '@jsxdocgen/parser';
import { markdownRenderer } from '@jsxdocgen/renderer';

const compFileContent = readFileSync('./Button.tsx', { encoding: 'utf-8' });
const scheme = componentParser(compFileContent);
const markdown = markdownRenderer(scheme);

console.log(markdown); // markdown file content
```

## 要做什么？

- [ ] CLI
- [ ] 插件系统
