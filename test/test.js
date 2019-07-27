'use strict';

var expect = require('chai').expect;
var Moz = require('../lib/Moz');
var Signature = require('../lib/signature');
var MozEndpoint = require('../lib/moz-endpoint');
var utils = require('../lib/utils');

const credentials = {
  accessId: process.env.ACCESS_ID,
  secretKey: process.env.SECRET_KEY
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

    it('updates expires to different threshold', () => {
      var moz = new Moz(credentials);
      moz.setExpires(500);
      expect(moz._api.expiresThreshold).to.equal(500);
    });

    it('updates expires to default threshold with no param', () => {
      var moz = new Moz(credentials);
      moz.setExpires(1000);
      moz.setExpires();

      expect(moz._api.expiresThreshold).to.equal(300);
    })

    it('explains property from definitions', () => {
      var moz = new Moz(credentials);
      expect(moz.explain('apu')).to.equal('Returns phrases found in links to the target URL');
    })

    it('has no explain for undefined definition', () => {
      var moz = new Moz(credentials);
      expect(moz.explain('moz')).to.equal('No explanation');
    })
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

});

describe('Utils', () => {
  describe('toTitleCase', () => {
    it('converts string to titlecase', () => {
      var string = 'hello world';
      expect(utils.toTitleCase(string)).to.equal('Hello World');
    });

    it('only capitalizes first letter of word', () => {
      var string = 'seoRocksTheWorld';

      expect(utils.toTitleCase(string)).to.equal('Seorockstheworld');
    });
  });

  describe('capitalize', () => {
    it('capitalizes a string', () => {
      var string = 'titleWithCapitals';

      expect(utils.capitalize(string)).to.equal('TitleWithCapitals');
    });
  });

  describe('pascalToCamelCase', () => {
    it('converts pascal case to camel case', () => {
      var string = 'ClassName';
      expect(utils.pascalToCamelCase(string)).to.equal('className');
    });
  })

  describe('isValidURL', () => {
    it('validates an url as correct', () => {
      var url = 'https://www.example.com';
      expect(utils.isValidURL(url)).to.equal(true);

      var url = 'https://example.io';
      expect(utils.isValidURL(url)).to.equal(true);

      var url = 'example.org';
      expect(utils.isValidURL(url)).to.equal(true);
    });

    it('validates an url as incorrect', () => {
      var url = 'https:/www.example.com';
      expect(utils.isValidURL(url)).to.equal(false);

      var url = 'www,examplecom';
      expect(utils.isValidURL(url)).to.equal(false);

      var url = 'ftp://www.example.c';
      expect(utils.isValidURL(url)).to.equal(false);
    });
  });

  describe('isArray', ()  => {
    it('correctly validates array', () => {
      expect(utils.isArray([1,2,3])).to.equal(true);
      expect(utils.isArray([])).to.equal(true);

      expect(utils.isArray(new Array(1,2,3))).to.equal(true);
      expect(utils.isArray(new Array(1))).to.equal(true);
      expect(utils.isArray(new Array())).to.equal(true);
    });

    it('correctly validates incorrect array type', () => {
      expect(utils.isArray("array")).to.equal(false);
      expect(utils.isArray(1)).to.equal(false);
      expect(utils.isArray({array: []})).to.equal(false);
      expect(utils.isArray({})).to.equal(false);
      expect(utils.isArray(function() {})).to.equal(false);
      expect(utils.isArray(null)).to.equal(false);
      expect(utils.isArray(undefined)).to.equal(false);
      expect(utils.isArray()).to.equal(false);
    });
  })

  describe('hasProperty', () => {
    it('finds property on object', () => {
      var obj = {
        prop: 'hello world'
      };

      expect(utils.hasProperty(obj, 'prop')).to.equal(true);

      var obj = {
        add: function(a, b) { return a + b }
      }

      expect(utils.hasProperty(obj, 'add')).to.equal(true);
    });

    it('does not find property on object', () => {
      expect(utils.hasProperty({}, 'prop')).to.equal(false);
      expect(utils.hasProperty('', 'prop')).to.equal(false);
      expect(utils.hasProperty(null, 'prop')).to.equal(false);
      expect(utils.hasProperty(undefined, 'prop')).to.equal(false);

      var obj = {};
      obj.prototype = {
        'prop': 123
      }

      expect(utils.hasProperty(obj, 'prop')).to.equal(false)
    })
  })
});
