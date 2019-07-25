'use strict';

var AnchorText = require('./endpoints/anchor-text');
var Links = require('./endpoints/links');
var Metadata = require('./endpoints/metadata');
var TopPages = require('./endpoints/top-pages');
var UrlMetrics = require('./endpoints/url-metrics');

module.exports = {
  AnchorText: AnchorText,
  Links: Links,
  Metadata: Metadata,
  TopPages: TopPages,
  UrlMetrics: UrlMetrics
};
