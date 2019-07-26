# moz-api 
[![Coverage Status](https://coveralls.io/repos/github/avamia-dm/moz-api/badge.svg?branch=master)](https://coveralls.io/github/avamia-dm/moz-api?branch=master) 
[![Build Status](https://travis-ci.org/avamia-dm/moz-api.svg?branch=master)](https://travis-ci.org/avamia-dm/moz-api)

Moz Link API wrapper written in javascript for node applications (can also run in the browser). Fetch link data and other metrics from various endpoints, including Url Metrics, Top Page Metrics, and others. The Link API is a paid plan, they offer a limited free version to the API as well.

## Installation

```bash
npm install --save moz-api
```

## Motivation

Sending requests directly to the api is tedious with the various bit masks that needs to be calculated for filtering as well as signing the request for authentication. We also didn't find any currently maintained projects available. This seemed like a good opportunity to build a simple to use interface.

## Usage / Examples

```javascript

var Moz = require('moz')

// initialize and configure client
const moz = new Moz({
  accessId: ACCESS_ID, 
  secretKey: SECRET_KEY
});

// fetch url metrics for moz.com
// return promise
moz.urlMetrics
  .fetch('moz.com', {
    cols: ['Title', 'Domain Authority'],
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })



```

## Compatibility

## Depedencies

* [Axios]()

## Resources

* [Moz Links Api Documentation][api-docs]

## License

This library is licensed under MIT. See [LICENSE][license].

[api-docs]: https://moz.com/help/links-api
[license]: https://github.com/avamia-dm/moz-api/blob/master/LICENSE