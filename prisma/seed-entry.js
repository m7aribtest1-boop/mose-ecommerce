const jiti = require('jiti')(__dirname + '/seed-entry.js');
jiti(require('path').resolve(process.argv[2]));