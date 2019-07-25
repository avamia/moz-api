'use strict';

var expect = require('chai').expect;
var Moz = require('../index.js');
var fs = require('fs');

var conf = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));

const credentials = {
  accessId: conf.credentials.accessId,
  secretKey: conf.credentials.secretKey 
}

describe('Moz', () => {
  describe("auth", () => {
    it('creates instance of moz with credentials', () => {
      var moz = new Moz(credentials);

      expect(moz).to.be.an('object')
      expect(moz).to.have.a.property('_api')
    })

    it('throws error without credentials', () => {
      
    }) 
  })
})