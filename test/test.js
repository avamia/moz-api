'use strict';

var expect = require('chai').expect;
var Moz = require('../lib/moz');
var Signature = require('../lib/signature');
var MozEndpoint = require('../lib/moz-endpoint');

var fs = require('fs');

var conf = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));

const credentials = {
  accessId: conf.credentials.accessId,
  secretKey: conf.credentials.secretKey 
}

describe('Moz', () => {
  describe("instantiate", () => {
    it('creates instance of moz with credentials', () => {
      var moz = new Moz(credentials);

      expect(moz).to.be.an.instanceof(Moz)
    });

    it('throws error without credentials', () => {
      expect(function() { new Moz() }).to.throw(Error);

      expect(function() { new Moz({
        accessId: credentials.accessId
      })}).to.throw(Error);

      expect(function() { new Moz({
        secretKey: credentials.secretKey
      })}).to.throw(Error);
    }); 

    it('has defined properties', () => {
      var moz = new Moz(credentials);

      expect(moz).to.be.an('object').have.all.keys(
        'anchorText',
        'links',
        'metadata',
        'topPages',
        'urlMetrics',
        '_api',
        'bitFlags',
        'signature'
      )
    })

    it('sets default expires', () => {
      var moz = new Moz(credentials);

      expect(moz._api.expiresThreshold).to.equal(300)
    });

    it('creates an instance of signature', () => {
      var moz = new Moz(credentials);

      expect(moz.signature).to.be.an.instanceof(Signature);
    });

    it('creates instances of moz endpoint', () => {
      var moz = new Moz(credentials);
      var endpoints = ['anchorText', 'links', 'topPages', 'metadata', 'urlMetrics'];

      for(var endpoint of endpoints) {
        expect(moz[endpoint]).to.be.an.instanceof(MozEndpoint) 
      }
    });
  });
});

describe('Signature', () => {
  it('generates a signature', () => {
    var moz = new Moz(credentials);

    expect(moz.signature.generate()).to.be.a('string')
  });

  it('creates an expiration after threshold', () => {  
    var moz = new Moz(credentials);

    expect(moz.signature.expires(300)).to.be.greaterThan(Date.now() / 1000)
  });

  it('gets expiration after generating signature', () => {
    var moz = new Moz(credentials);
    moz.signature.generate();

    expect(moz.signature.getExpires()).to.equal(moz.signature.expires(300))
  });

})
