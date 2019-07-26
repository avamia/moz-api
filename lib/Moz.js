'use strict';

var utils = require('./utils');
var endpoints = require('./endpoints');
var Signature = require('./signature');
var definitions = require('./definitions');
var bitFlags = require('./bit-flags');

Moz.DEFAULT_EXPIRES = 300;

function Moz(options) {
  this._api = {
    host: 'lsapi.seomoz.com',
    resource: 'linkscape',
    expiresThreshold: 300
  };

  this.bitFlags = bitFlags;

  this.setAccessId(options.accessId);
  this.setSecretKey(options.secretKey);

  if (!this._api.accessId) throw Error('Access Id required');
  if (!this._api.secretKey) throw Error('Secret Key required');

  this._prepResources();

  this.signature = new Signature(this);
}

Moz.prototype = {
  setAccessId(accessId) {
    this._setApiField('accessId', accessId);
  },

  setSecretKey(secretKey) {
    this._setApiField('secretKey', secretKey);
  },

  setExpires(expires) {
    this._setApiField(
      'expiresThreshold',
      expires == null ? Moz.DEFAULT_EXPIRES : expires
    );
  },

  explain(key) {
    if (!utils.hasProperty(definitions, key)) {
      return 'No explanation';
    }
    return definitions[key];
  },

  _setApiField(key, value) {
    this._api[key] = value;
  },

  _prepResources() {
    var that = this;
    Object.keys(endpoints).forEach(function (name) {
      that[utils.pascalToCamelCase(name)] = new endpoints[name](this);
    });
  }
};

module.exports = Moz;
module.exports.Moz = Moz;
