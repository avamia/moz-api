'use strict';

var crypto = require('crypto');

function Signature(moz) {
  this._moz = moz;
  this._expires = 0;
}

Signature.prototype = {
  setExpires(expires) {
    this._expires = expires;
  },

  getExpires() {
    return this._expires;
  },

  expires(threshold) {
    var expires = Math.floor((Date.now() / 1000)) + threshold;
    return expires;
  },

  generate() {
    var expires = this.expires(this._moz._api.expiresThreshold);
    var stringToSign = this._moz._api.accessId + '\n' + expires;
    var signature = crypto.createHmac('sha1', this._moz._api.secretKey).update(stringToSign).digest('base64');

    this.setExpires(expires);

    return encodeURIComponent(signature);
  }
};

module.exports = Signature;
