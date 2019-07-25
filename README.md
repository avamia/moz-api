moz-api
=============
Moz Link API client - fetch different endpoints with easy filtering and sorting.

Installation
------------
    npm install --save moz-api

Usage / Examples
----------------
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