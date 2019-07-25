'use strict';

var utils        = require('../utils');
var MozEndpoint  = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'anchor-text',

  bitFlagsMapping: {
    'cols': 'anchor-text',
    'sourceCols' : 'url-metrics'
  },

  acceptedParams: {
    scope: null,
    filter: null,
    cols: null,
    sourceCols: null,
    limit: 25,
    offset: 0,
  },

  scopes: ['phrase_to_page', 'phrase_to_subdomain', 'phrase_to_domain', 
           'term_to_page',  'term_to_subdomain', 'term_to_domain'],

  filters: ['external'],

  validate(target, params) {
    this._validateParams(params, this.acceptedParams);
    this._validateCols(params, this.bitFlagsMapping);

    this._validatePresence(params.scope, 'scope');
    this._validateString(params.scope)

    this._validateFieldInArray(params.scope, this.scopes, 'scopes');

    this._validateNumeric(params.limit); 
    this._validateNumeric(params.offset);
    
    this._validatePresence(target, 'target');
    this._validateUrl(target);
  },

  fetch(target, params) {
    this.validate(target, params);
    
    return this.get(target, params);     
  }
});