const program = require('commander');
const { JSONPath } = require('jsonpath-plus');
const process = require('process');
const pkg = require('./package.json');
const jacksonConverter = require('./index');
const fs = require('fs');
const { resolve } = require('path');

program
  .version(pkg.version)
  .option('-j, --json <jsonString>', 'Json content')
  .option('-p, --path <jsonPath>', 'Json path')
  .option('-f, --file <string>', 'Json file')
  .option('-u, --unwrap', 'Unwrap array if only one result');

program.parse(process.argv);

const options = program.opts();
const wrap = !options.unwrap;

const jsonString = options.file ? fs.readFileSync(resolve('./', options.file), { encoding: 'utf-8' }) : options.json;

const result = JSONPath({
  path: options.path,
  json: jacksonConverter.parse(jsonString),
  wrap
});
console.log(jacksonConverter.stringify(result));
