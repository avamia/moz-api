'use strict';

var utils = require('../utils');
var axios = require('axios');
var bitFlagsHash = require('../bit-flags');

function UrlMetrics(moz) {
  this.endpoint = 'url-metrics';

  this.MAX_LIMIT = 50;
  this.MAX_OFFSET = 100000;

  this.acceptedParams = {
    cols: null,
    sourceCols: null,
    targetCols: null,
    linkCols: null,
    limit: 25,
    offset: 0,
  }

  this._moz = moz;
}

UrlMetrics.prototype = {
  _httpMethodByType(urls) {
    if(typeof urls === 'string') {
      return 'GET';
    } else if (urls.constructor === Array) {
      return 'POST'
    } else {
      throw Error("Wrong datatype provided.")
    }
  },

  _validateUrl(url) {
    if(!utils.isValidURL(url)) {
      throw Error("Url: " + url + " is not a valid url");
    }
  },

  _validateUrls(urls) {
    for(var i = 0; i < urls.length; ++i) {
      this._validateUrl(urls[i]);
    }
  },

  _validateCols(cols) {
    if(!cols) return;

    if(cols.constructor !== Array) {
      throw Error("Wrong datatype provided.")
    }

    for(var i = 0; i < cols.length; ++i) {
      const key = cols[i];
      if(!bitFlagsHash.hasOwnProperty(key)) {
        throw Error("Invalid Url Metric");
      }
    }
  },

  _validateNumeric(value) {
    if(!value) return;

    if(typeof value !== 'number') {
      throw Error('Invalid datatype provided.')
    }
  },

  _valdiateParams(params) {
    for(const key in params) {
      if(!this.acceptedParams.hasOwnProperty(key)) {
        throw Error('Unrecognized parameter');
      }
    }

    this._validateCols(params.cols);
    this._validateCols(params.sourceCols)
    this._validateCols(params.targetCols)
    this._validateCols(params.linkCols)

    this._validateNumeric(params.limit); 
    this._validateNumeric(params.offset); 
  },

  _buildCol(cols) {
    var flag = 0;
    for(var i = 0; i < cols.length; ++i) {
      var col = cols[i];
      flag += bitFlagsHash[col];
    }

    return flag;
  },

  _appendUrlParams(key, value, ampersand = true) {
    return utils.capitalize(key) + "=" + value + (ampersand ? "&" : '')
  },

  _signedAuthParams() {
    var string =  ""
    var signature = this._moz.signature.generate();
    var expires   = this._moz.signature.getExpires();

    string += this._appendUrlParams('AccessID', this._moz._api.accessId);
    string += this._appendUrlParams('Expires', expires);
    string += this._appendUrlParams('Signature', signature, false)

    return string;
  },

  _buildEndpoint() {
    var url = "http://" + this._moz._api.host + "/"

    url += this._moz._api.resource + "/"
    url += this.endpoint + "/";

    return url;
  },

  _searchParams(params) {
    var string = "";

    for(const key in params) {
      if(!params[key]) continue;
      switch(key) {
        case 'cols':
        case 'sourceCols':
        case 'targetCols':
        case 'linkCols':
          const bitFlag = this._buildCol(params[key]);
          string += this._appendUrlParams(key, bitFlag);
          break;
        case 'limit':
        case 'offset':
          string += this._appendUrlParams(key, params[key]);
          break;
      }
    }

    return string;
  },

  _buildUrlWithTarget(target, params) {
    var url = this._buildEndpoint();
    url += target + "?" 

    const mergedParams = Object.assign({}, this.acceptedParams, params); 

    url += this._searchParams(mergedParams);
    url += this._signedAuthParams()

    return url;
  },

  _buidUrl(params) {
    var url = this._buildEndpoint();
    url += "?"

    const mergedParams = Object.assign({}, this.acceptedParams, params); 

    url += this._searchParams(mergedParams);
    url += this._signedAuthParams()

    return url;
  },

  get(target, params) {
    const url = this._buildUrlWithTarget(target, params)
    return axios.get(url)
  },

  post(target, params) {
    const url = this._buidUrl(params);
    return axios.post(url, target)
  },

  fetch(target, params) {
    this._valdiateParams(params);
    var httpMethod = this._httpMethodByType(target);

    if(httpMethod === 'GET') {
      this._validateUrl(target);

      return this.get(target, params)
    } else if (httpMethod === 'POST') {
      this._validateUrls(target);

      return this.post(target, params);
    } else {
      throw Error('Invalid option');
    }
  }
}

module.exports = UrlMetrics;