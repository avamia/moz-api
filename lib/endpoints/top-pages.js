'use strict';

var MozEndpoint = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'top-pages',

  bitFlagsMapping: {
    cols: 'url-metrics'
  },

  acceptedParams: {
    filter: null,
    sort: null,
    cols: null,
    limit: 25,
    offset: 0
  },

  sorting: ['page_authority', 'domains_linking_page'],
  filters: ['all', 'status200', 'status301', 'status302', 'status4xx', 'status5xx'],

  validate(target, params) {
    this._validateParams(params, this.acceptedParams);
    this._validateCols(params, this.bitFlagsMapping);

    this._validateNumeric(params.limit);
    this._validateNumeric(params.offset);

    this._validateString(params.filter);

    this._validateFieldInArray(params.filter, this.filters, 'filters');
    this._validateFieldInArray(params.sort, this.sorting, 'sorting');

    this._validatePresence(target, 'target');
    this._validateUrl(target);
  },

  fetch(target, params) {
    this.validate(target, params);

    return this.get(target, params);
  }
});
