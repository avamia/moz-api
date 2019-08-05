'use strict';

var axios = require('axios');
const utils = require('./utils');

MozEndpoint.extend = utils.protoExtend;

MozEndpoint.MAX_LIMIT = 50;
MozEndpoint.MAX_OFFSET = 100000;

function MozEndpoint(moz) {
  this._moz = moz;
  this._axios = axios;
}

MozEndpoint.prototype = {
  endpoint: '',
  bitFlagsMapping: {},
  acceptedParams: {},

  scopes: [],
  filters: [],
  sorting: [],

  _validateUrl(url) {
    if (!url) return;

    if (!utils.isValidURL(url)) {
      throw Error('Url: ' + url + ' is not a valid url');
    }

    return true;
  },

  _validateUrls(urls) {
    var i;

    if(!utils.isArray(urls)) {
      throw TypeError('Invalid datatype');
    }

    for (i = 0; i < urls.length; ++i) {
      this._validateUrl(urls[i]);
    }

    return true;
  },

  _validateNumeric(value) {
    if (value === null || value === undefined) return;

    if (typeof value !== 'number' || !isFinite(value)) {
      throw TypeError('Invalid datatype');
    }

    return true;
  },

  _validateMapping(mapping, a, b) {
    var i;

    if (!mapping || !a || !b) return;

    if (utils.hasProperty(mapping, a)) {
      const validOptions = mapping[a];

      if (!utils.isArray(validOptions)) {
        throw TypeError('Invalid datatype for mapping');
      }

      for (i = 0; i < validOptions.length; ++i) {
        if (validOptions[i] === b) {
          return true;
        }
      }

      throw Error('Invalid mapping between ' + a + ' and ' + b);
    }
  },

  _validateMappings(mapping, a, b) {
    var i;

    if (a && utils.isArray(a)) {
      for (i = 0; i < a.length; ++i) {
        this._validateMapping(mapping, a[i], b);
      }

      return true;
    } else {
      return this._validateMapping(mapping, a, b);
    }
  },

  _validateString(value) {
    if (value === undefined || value === null) return;

    if (typeof value !== 'string') {
      throw TypeError('Invalid datatype provided.');
    }

    return true;
  },

  _validateColType(cols, type) {
    var i;

    if (!cols) return;

    if (!utils.isArray(cols)) {
      throw TypeError('Wrong datatype provided.');
    }

    for (i = 0; i < cols.length; ++i) {
      const key = cols[i];

      if (!utils.hasProperty(this._moz.bitFlags[type], key)) {
        throw Error('Invalid Bit Flag: ' + key);
      }

      if (utils.containsValue(this._moz.bitFlags.deprecated, key)) {
        console.warn(key + ' is deprecated. Col may not work as expected.');
      }
    }

    return true;
  },

  _validateCols(params, bitFlagsMapping) {
    var that = this;

    Object.keys(bitFlagsMapping).forEach(function (key) {
      that._validateColType(params[key], bitFlagsMapping[key]);
    });

    return true;
  },

  _validateFieldInArray(field, array, type) {
    var i;

    if (!field) return;

    if (!array) {
      throw Error('No field found on prototype for ' + type);
    }

    if (!utils.isArray(array)) {
      throw TypeError('Incorrect datatype for ' + type);
    }

    if(utils.isArray(field)) {
      throw TypeError('Incorrect datatype for ' + type);
    }

    for (i = 0; i < array.length; ++i) {
      if (array[i] === field) {
        return true;
      }
    }

    throw Error(field + ' not found in ' + type + '.');
  },

  _validatePresence(value, type) {
    if (value === null || value === undefined) {
      throw Error(type + ' not present!');
    }

    return true;
  },

  _validateParams(params, acceptedParams) {
    Object.keys(params).forEach(function (key) {
      if (!utils.hasProperty(acceptedParams, key)) {
        throw Error('Unrecognized parameter');
      }
    });

    return true;
  },

  _encodeUrl(url) {
    if (!url) return '';
    return encodeURIComponent(url);
  },

  _appendUrlParams(key, value, ampersand = true) {
    return utils.capitalize(key) + '=' + value + (ampersand ? '&' : '');
  },
  
  _signedAuthParams() {
    var string = '';
    var signature = this._moz.signature.generate();
    var expires = this._moz.signature.getExpires();

    string += this._appendUrlParams('AccessID', this._moz._api.accessId);
    string += this._appendUrlParams('Expires', expires);
    string += this._appendUrlParams('Signature', signature, false);

    return string;
  },

  _buildEndpoint() {
    var url = 'http://' + this._moz._api.host + '/';

    url += this._moz._api.resource + '/';
    url += this.endpoint + '/';

    return url;
  },

  _buildCol(cols, type) {
    var flag = 0;
    var col;
    var i;

    for (i = 0; i < cols.length; i++) {
      col = cols[i];
      flag += this._moz.bitFlags[type][col];
    }

    return flag;
  },

  _buildFilter(filter) {
    if (utils.isArray(filter)) {
      return filter.join('+');
    }
    return filter;
  },

  _queryParams(params) {
    var string = '';
    var that = this;
    var isEnd;
    var keys = Object.keys(params);

    keys.forEach(function (key, index) {
      isEnd = index < keys.length - 1; 

      if (params[key]) {
        switch (key) {
          case 'cols':
          case 'sourceCols':
          case 'targetCols':
          case 'linkCols':
            const bitFlag = that._buildCol(params[key], that.bitFlagsMapping[key]);
            string += that._appendUrlParams(key, bitFlag, isEnd);
            break;

          case 'filter':
            const filter = that._buildFilter(params[key]);
            string += that._appendUrlParams(key, filter, isEnd);
            break;

          case 'sourceDomain':
            const url = that._encodeUrl(params[key]);
            string += that._appendUrlParams(key, url, isEnd);
            break;

          case 'sorting':
          case 'scope':
          case 'limit':
          case 'offset':
            string += that._appendUrlParams(key, params[key], isEnd);
            break;
          default:
            string += '';
        }
      }
    });

    return string;
  },

  _buildUrlWithTarget(target, params) {
    var url = this._buildEndpoint();
    url += encodeURIComponent(target) + '?';

    const mergedParams = Object.assign({}, this.acceptedParams, params);

    url += this._queryParams(mergedParams);
    url += "&"
    url += this._signedAuthParams();

    return url;
  },

  _buildUrl(params) {
    var url = this._buildEndpoint();
    url += '?';

    const mergedParams = Object.assign({}, this.acceptedParams, params);
    url += this._queryParams(mergedParams);
    url += "&"
    url += this._signedAuthParams();

    return url;
  },

  get(target, params = {}) {
    const url = this._buildUrlWithTarget(target, params);
    return this._axios.get(url);
  },

  post(target, params = {}) {
    const url = this._buildUrl(params);
    return this._axios.post(url, target);
  }
};

module.exports = MozEndpoint;
