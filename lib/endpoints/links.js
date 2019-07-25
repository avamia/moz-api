'use strict';

var utils        = require('../utils');
var MozEndpoint  = require('../moz-endpoint');

module.exports = MozEndpoint.extend({
  endpoint: 'links',
  
  bitFlagsMapping: {
    'sourceCols': 'url-metrics',
    'targetCols': 'url-metrics',
    'linkCols': 'links'
  },

  acceptedParams: {
    scope: null,
    sort: null,
    filter: null,
    sourceDomain: null,
    sourceCols: null,
    targetCols: null,
    linkCols: null,
    limit: 25,
    offset: 0,
  },

  scopes: ['page_to_page', 'page_to_subdomain', 'page_to_domain', 'subdomain_to_page',
           'subdomain_to_subdomain', 'subdomain_to_domain', 'domain_to_page', 'domain_to_subdomain',
           'domain_to_domain'],
  
  filters: ['external', 'follow', 'nofollow', 'nonequity', 'equity', 'rel_canonical', '301', '302'],

  sorting: ['page_authority', 'domain_authority', 'domains_linking_domain', 'domains_linking_page', 'spam_score'],

  scopeToSortMapping: {
    'page_to_page'        : ['page_authority', 'domain_authority', 'domains_linking_page'],
    'page_to_subdomain'   : ['page_authority', 'domain_authority', 'domains_linking_page'],
    'page_to_domain'      : ['page_authority', 'domain_authority', 'domains_linking_page'],
    'domain_to_page'      : ['domain_authority', 'domains_linking_domain'],
    'domain_to_subdomain' : ['domain_authority', 'domains_linking_domain'],
    'domain_to_domain'    : ['domain_authority', 'domains_linking_domain'],
  },

  filterToSortMapping: {
    '302': ['page_authority', 'domain_authority']
  },

  validate(target, params) {
    this._validateParams(params, this.acceptedParams);
    this._validateCols(params, this.bitFlagsMapping);

    this._validateString(params.scope)

    this._validateFieldInArray(params.scope, this.scope, 'scopes');
    this._validateFieldInArray(params.filter, this.filters, 'filters'); 
    this._validateFieldInArray(params.sort, this.sorting, 'sorting');

    this._validateMappings(this.scopeToSortMapping, params.scope, params.sort)
    this._validateMappings(this.filterToSortMapping, params.filter, params.sort)

    this._validateNumeric(params.limit); 
    this._validateNumeric(params.offset);

    this._validatePresence(target, 'target');
    this._validateUrl(target);

    this._validateUrl(params.sourceDomain)
  },

  fetch(target, params) {
    this.validate(target, params);

    return this.get(target, params);
  }

});