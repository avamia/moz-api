'use strict';

var utils = require('../utils');
var MozEndpoint = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'url-metrics',

  bitFlagsMapping: {
    cols: 'url-metrics',
    sourceCols: 'url-metrics',
    targetCols: 'url-metrics',
    linkCols: 'url-metrics'
  },

  acceptedParams: {
    cols: null,
    sourceCols: null,
    targetCols: null,
    linkCols: null,
    limit: 25,
    offset: 0
  },

  _httpMethodByType(urls) {
    if (typeof urls === 'string') {
      return 'GET';
    }

    if (utils.isArray(urls)) {
      return 'POST';
    }

    return '';
  },

  validate(target, params) {
    this._validateParams(params, this.acceptedParams);
    this._validateCols(params, this.bitFlagsMapping);

    this._validateNumeric(params.limit);
    this._validateNumeric(params.offset);

    this._validatePresence(target, 'target');

    if (utils.isArray(target)) {
      this._validateUrls(target);
    } else {
      this._validateUrl(target);
    }
  },

  fetch(target, params) {
    this.validate(target, params);

    const httpMethod = this._httpMethodByType(target);

    if (httpMethod === 'GET') {
      return this.get(target, params);
    } else if (httpMethod === 'POST') {
      return this.post(target, params);
    } else {
      throw Error('Invalid option');
    }
  }
});
