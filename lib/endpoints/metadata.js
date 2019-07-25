'use strict';

var utils        = require('../utils');
var bitFlagsHash = require('../bit-flags');
var MozEndpoint  = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'metadata',

  fetch(command) {
    return this.get(command)
  }
});