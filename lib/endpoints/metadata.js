'use strict';

var MozEndpoint = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'metadata',

  fetch(command) {
    return this.get(command);
  }
});
