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
  var moz = new Moz(credentials);

  it('generates a signature', () => {
    expect(moz.signature.generate()).to.be.a('string')
  });

  it('creates an expiration after threshold', () => {  
    expect(moz.signature.expires(300)).to.be.greaterThan(Date.now() / 1000)
  });

  it('gets expiration after generating signature', () => {
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

  describe('containsValue', () => {
    it('finds value in array', () => {
      expect(utils.containsValue([1,2,3,4,5], 3)).to.equal(true) 
      expect(utils.containsValue(['hello', 'world', 'this', 'is', 'a', 'test'], 'hello')).to.equal(true) 
    })

    it('does not find value in array', () => {
      expect(utils.containsValue([1,2,3,4,5], 6)).to.equal(false);
      expect(utils.containsValue([], 'moz')).to.equal(false);
    })

    it('throws error without array provided', () => {
      expect(function() { utils.containsValue('hello', 'world') }).to.throw(TypeError, 'Invalid datatype')
    })
  })
});


describe('MozEndpoint', () => {
  var moz = new Moz(credentials)

  describe('_validateUrl', () => {
    var mozEndpoint = new MozEndpoint(moz);

    it('returns if no url provided', () => {
      expect(mozEndpoint._validateUrl()).to.equal(undefined)
    });

    it('validates a url succesfully', () => {
      expect(function() { mozEndpoint._validateUrl('moz.com') }).to.not.throw();
      expect(mozEndpoint._validateUrl('moz.com')).to.equal(true)
    });

    it('throws an error with invalid url', () => {
      expect(function() { mozEndpoint._validateUrl('mozcom'); }).to.throw(Error, 'Url: mozcom is not a valid url');
    });
  })

  describe('_validateUrls',  () =>  {
    var mozEndpoint = new MozEndpoint(moz);

    it('validates an array of urls', () => {
      expect(function() { mozEndpoint._validateUrls(['moz.com', 'https://google.com', 'www.facebook.com']) }).to.not.throw()
      expect(mozEndpoint._validateUrls(['moz.com', 'https://google.com', 'www.facebook.com'])).to.equal(true);
    })

    it('throws type error with invalid type', () => {
      expect(function() { mozEndpoint._validateUrls('moz.com') }).to.throw(TypeError, 'Invalid datatype');
      expect(function() { mozEndpoint._validateUrls(1) }).to.throw(TypeError, 'Invalid datatype');
      expect(function() { mozEndpoint._validateUrls({}) }).to.throw(TypeError, 'Invalid datatype');
    });

    it('throws error with invalid url in array', () => {
      expect(function() { mozEndpoint._validateUrls(['moz.com', 'https:/google.com', 'www.facebook.com']) })
        .to.throw(Error, 'Url: https:/google.com is not a valid url')
    })
  });

  describe('_validateNumeric', () => {
    var mozEndpoint = new MozEndpoint(moz);

    it('returns if no value is provided', () => {
      expect(mozEndpoint._validateNumeric()).to.equal(undefined)
      expect(mozEndpoint._validateNumeric(null)).to.equal(undefined)
    });

    it('validates a numeric value', () => {
      expect(function() { mozEndpoint._validateNumeric(5) }).to.not.throw();
      expect(mozEndpoint._validateNumeric(5)).to.equal(true)

      expect(function() { mozEndpoint._validateNumeric(23.45) }).to.not.throw();
      expect(mozEndpoint._validateNumeric(23.45)).to.equal(true)

      expect(function() { mozEndpoint._validateNumeric(0) }).to.not.throw();
      expect(mozEndpoint._validateNumeric(0)).to.equal(true)
    })

    it('throws type error with invalid type string', () => {
      expect(function() { mozEndpoint._validateNumeric('1') }).to.throw(TypeError, 'Invalid datatype');
    })

    it('throws type error with invalid type Infinity', () => {
      expect(function() { mozEndpoint._validateNumeric(Infinity) }).to.throw(TypeError, 'Invalid datatype');
    })

    it('throws type error with invalid type object', () => {
      expect(function() { mozEndpoint._validateNumeric({}) }).to.throw(TypeError, 'Invalid datatype');
    })

    it('throws type error with invalid type array', () => {
      expect(function() { mozEndpoint._validateNumeric([]) }).to.throw(TypeError, 'Invalid datatype');
    })
  });

  describe('_validateMapping', () => {
    var mozEndpoint =  new MozEndpoint(moz);
    var mapping = {
      page_to_page: ['page_authority', 'domain_authority', 'domains_linking_page'],
      page_to_subdomain: ['page_authority', 'domain_authority', 'domains_linking_page'],
      page_to_domain: ['page_authority', 'domain_authority', 'domains_linking_page'],
      domain_to_page: ['domain_authority', 'domains_linking_domain'],
      domain_to_subdomain: ['domain_authority', 'domains_linking_domain'],
      domain_to_domain: ['domain_authority', 'domains_linking_domain']
    };

    it('validates mapping', () => {
      expect(mozEndpoint._validateMapping(mapping, 'page_to_page', 'domain_authority')).to.equal(true)
      expect(mozEndpoint._validateMapping(mapping, 'domain_to_domain', 'domains_linking_domain')).to.equal(true) 
    });

    it('does nothing without params', () => {
      expect(mozEndpoint._validateMapping()).to.equal(undefined)
      expect(mozEndpoint._validateMapping(mapping)).to.equal(undefined)
      expect(mozEndpoint._validateMapping(mapping, 'page_to_page')).to.equal(undefined)
      expect(mozEndpoint._validateMapping(mapping, 'page_to_page', null)).to.equal(undefined)
      expect(mozEndpoint._validateMapping(mapping, null, 'domain_authority')).to.equal(undefined)
      expect(mozEndpoint._validateMapping(null, 'page_to_page', 'domain_authority')).to.equal(undefined)
      expect(mozEndpoint._validateMapping(null, null, null)).to.equal(undefined)
    });

    it('does nothing if mapping not defined', () => {
      expect(mozEndpoint._validateMapping(mapping, 'subdomain_to_subdomain', 'page_authority')).to.equal(undefined)
    })

    it('throws error with invalid mapping datatype', () => {
      expect(function() { mozEndpoint._validateMapping({
        page_to_page: 'page_authority'
      }, 'page_to_page', 'page_authority') }).to.throw(TypeError, 'Invalid datatype for mapping')
    })

    it('throws error with invalid mapping', () => {
      expect(function() {
        mozEndpoint._validateMapping(mapping, 'page_to_page', 'domains_linking_domain')
      }).to.throw(Error, 'Invalid mapping between page_to_page and domains_linking_domain')
    })
  })

  describe('_validateMappings', () => {
    var mozEndpoint =  new MozEndpoint(moz);
    var mapping = {
      page_to_page: ['page_authority', 'domain_authority', 'domains_linking_page'],
      page_to_subdomain: ['page_authority', 'domain_authority', 'domains_linking_page'],
      page_to_domain: ['page_authority', 'domain_authority', 'domains_linking_page'],
      domain_to_page: ['domain_authority', 'domains_linking_domain'],
      domain_to_subdomain: ['domain_authority', 'domains_linking_domain'],
      domain_to_domain: ['domain_authority', 'domains_linking_domain']
    };

    it('validates mappings', () => {
      expect(mozEndpoint._validateMappings(mapping, ['page_to_page', 'domain_to_page'], 'domain_authority')).to.equal(true)
      expect(mozEndpoint._validateMappings(mapping, ['domain_to_domain'], 'domains_linking_domain')).to.equal(true) 
      expect(mozEndpoint._validateMappings(mapping, 'domain_to_subdomain', 'domains_linking_domain')).to.equal(true) 
    });

    it('throws error with invalid mapping', () => {
      expect(function() {
        mozEndpoint._validateMappings(mapping, ['page_to_page'], 'domains_linking_domain')
      }).to.throw(Error, 'Invalid mapping between page_to_page and domains_linking_domain')

      expect(function() {
        mozEndpoint._validateMappings(mapping, ['domain_to_page', 'page_to_page'], 'domains_linking_domain')
      }).to.throw(Error, 'Invalid mapping between page_to_page and domains_linking_domain')
    })
  })

  describe("_validateString", () => {
    var mozEndpoint = new MozEndpoint(moz);

    it('validates string', () => {
      expect(mozEndpoint._validateString('hello world')).to.equal(true)
      expect(mozEndpoint._validateString('')).to.equal(true)
    })

    it('does nothing with empty value', () => {
      expect(mozEndpoint._validateString()).to.equal(undefined)
      expect(mozEndpoint._validateString(null)).to.equal(undefined)
    })

    it('throws error with invalid datatype', () => {
      expect(function() {
        mozEndpoint._validateString(123)
      }).to.throw(TypeError, 'Invalid datatype provided.') 

      expect(function() {
        mozEndpoint._validateString({'hello': 'world'})
      }).to.throw(TypeError, 'Invalid datatype provided.') 
    })
  })

});
