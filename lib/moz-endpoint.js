'use strict';

var axios = require('axios');
const utils = require('./utils');

MozEndpoint.extend = utils.protoExtend;

MozEndpoint.MAX_LIMIT = 50;
MozEndpoint.MAX_OFFSET = 100000;

function MozEndpoint(moz) {
  this._moz = moz;
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
  },

  _validateUrls(urls) {
    var i;

    for (i = 0; i < urls.length; ++i) {
      this._validateUrl(urls[i]);
    }
  },

  _validateNumeric(value) {
    if (!value) return;

    if (typeof value !== 'number') {
      throw Error('Invalid datatype provided.');
    }
  },

  _validateMapping(mapping, a, b) {
    var i;

    if (!mapping || !a || !b) return;

    if (utils.hasProperty(mapping, a)) {
      const validOptions = mapping[a];

      if (!utils.isArray(validOptions)) {
        throw Error('Invalid datatype for mapping');
      }

      for (i = 0; i < validOptions.legnth; ++i) {
        if (validOptions[i] === b) {
          return;
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
    } else {
      this._validateMapping(mapping, a, b);
    }
  },

  _validateString(value) {
    if (!value) return;

    if (typeof value !== 'string') {
      throw Error('Invalid datatype provided.');
    }
  },

  _isDeprecated(keys, value) {
    var i;

    for (i = 0; i < keys.length; ++i) {
      if (keys[i] === value) {
        return true;
      }
    }

    return false;
  },

  _validateColType(cols, type) {
    var i;

    if (!cols) return;

    if (!utils.isArray(cols)) {
      throw Error('Wrong datatype provided.');
    }

    for (i = 0; i < cols.length; ++i) {
      const key = cols[i];

      if (!utils.hasProperty(this._moz.bitFlags[type], key)) {
        throw Error('Invalid Url Metric: ' + key);
      }

      if (this._isDeprecated(this._moz.bitFlags.deprecated, key)) {
        console.warn(key + ' is deprecated. Col may not work as expected.');
      }
    }
  },

  _validateCols(params, bitFlagsMapping) {
    Object.keys(bitFlagsMapping).forEach(function (key) {
      this._validateColType(params[key]);
    });
  },

  _validateFieldInArray(field, array, type) {
    var i;

    if (!field) return;

    if (!array) {
      throw Error('No field found on prototype for ' + type);
    }

    if (!utils.isArray(array)) {
      throw Error('Incorrect datatype for ' + type);
    }

    for (i = 0; i < array.length; ++i) {
      if (array[i] === field) {
        return;
      }
    }

    throw Error('Incorrect ' + type + ' defined.');
  },

  _validatePresence(value, type) {
    if (value === null || value === undefined) {
      throw Error(type + ' not present!');
    }
  },

  _validateParams(params, acceptedParams) {
    Object.keys(params).forEach(function (key) {
      if (!utils.hasProperty(acceptedParams, key)) {
        throw Error('Unrecognized parameter');
      }
    });
  },

  _encodeUrl(url) {
    if (!url) return '';
    return encodeURIComponent(url);
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

  _appendUrlParams(key, value, ampersand = true) {
    return utils.capitalize(key) + '=' + value + (ampersand ? '&' : '');
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

    Object.keys(params).forEach(function (key) {
      if (params[key]) {
        switch (key) {
          case 'cols':
          case 'sourceCols':
          case 'targetCols':
          case 'linkCols':
            const bitFlag = this._buildCol(params[key], this.bitFlagsMapping[key]);
            string += this._appendUrlParams(key, bitFlag);
            break;

          case 'filter':
            const filter = this._buildFilter(params[key]);
            string += this._appendUrlParams(key, filter);
            break;

          case 'sourceDomain':
            const url = this._encodeUrl(params[key]);
            string += this._appendUrlParams(key, url);
            break;

          case 'scope':
          case 'limit':
          case 'offset':
            string += this._appendUrlParams(key, params[key]);
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
    url += this._signedAuthParams();

    return url;
  },

  _buidUrl(params) {
    var url = this._buildEndpoint();
    url += '?';

    const mergedParams = Object.assign({}, this.acceptedParams, params);
    url += this._queryParams(mergedParams);
    url += this._signedAuthParams();

    return url;
  },

  get(target, params = {}) {
    const url = this._buildUrlWithTarget(target, params);
    return axios.get(url);
  },

  post(target, params = {}) {
    const url = this._buidUrl(params);
    return axios.post(url, target);
  }
};

module.exports = MozEndpoint;
