const program = require('commander');
const { JSONPath } = require('jsonpath-plus');
const process = require('process');
const pkg = require('./package.json');
const jacksonConverter = require('./index');

program
  .version(pkg.version)
  .option('-j, --json <jsonString>', 'Json content')
  .option('-p, --path <jsonPath>', 'Json path')
  .option('-u, --unwrap', 'Unwrap array if only one result');

program.parse(process.argv);

const options = program.opts();
const wrap = !options.unwrap;
const result = JSONPath({
  path: options.path,
  json: jacksonConverter.parse(options.json),
  wrap
});
console.log(jacksonConverter.stringify(result));
