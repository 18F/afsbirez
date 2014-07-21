'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  authkey: process.env.JWT_AUTH_KEY || '873aed37ccbf33ca345ad861e2a4f5c2f1b52bcd'
};
