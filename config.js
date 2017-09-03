var path = require('path');
var os = require('os');

var config = {
  // This should resolve to the User's home dir. It can be changed to any absolute path, ex
  // dataDirectory: 'C:\\Program Files\\ManuScript\\Data',
  dataDirectory: path.join(os.homedir(), 'Documents', 'Manuscript'),
};

/*
 * Do any fancy config shit here
 */


module.exports = config;