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

  generate() {
    var expires = Math.floor((Date.now() / 1000)) + this._moz._api.expiresThreshold;
    this.setExpires(expires);
    
    var stringToSign = this._moz._api.accessId + "\n" + expires;
    var signature = crypto.createHmac('sha1', this._moz._api.secretKey).update(stringToSign).digest('base64')

    return encodeURIComponent(signature);
  }
}

module.exports = Signature