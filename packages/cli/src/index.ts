import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { program } from 'commander';
import parser from '@jsxdocgen/parser';
// import renderer from '@jsxdocgen/renderer';

program
  .description(
    'Automatically read functions or components files and generate documents.'
  )
  .argument('<input-file-path>', 'Which file do you want to read?')
  .argument('[output-file-path]', 'Which file do you want to output to?')
  .action((inputFilePath, outputFilePath?) => {
    const filePath = resolve(process.cwd(), inputFilePath);
    const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
    const parseResult = parser(fileContent);

    if (outputFilePath) {
      // TODO
    }
  });

program.parse();
