const args = require('minimist')(process.argv.slice(2));

let env = 'dev';
if (args.env) {
  switch (args.env) {
    case 'prod':
      env = 'prod';
      break;
  }
}

const getConfig = env => require('./webpack/' + env + '.config');

module.exports = getConfig(env);
