<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Ideal%20Postcodes%20Core%20Logo@3x.png" alt="Ideal Postcodes Core Interface">
</h1>

[![CircleCI](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master.svg?style=svg)](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/ideal-postcodes/core-interface/badge.svg?branch=master)](https://coveralls.io/github/ideal-postcodes/core-interface?branch=master)
![Dependency Status](https://david-dm.org/ideal-postcodes/core-interface.svg) 
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=RGl2bTU2Z3l4MGZNR1ZZREpyajlNaXZFMElZMkNCNENKRHNCMCtyVTBrbz0tLXdVODl3TlRJejA1MWpiTzYzaTBsZ1E9PQ==--8eb0b38bd782e0145dc4dc01e093c861828dbfa8)](https://www.browserstack.com/automate/public-build/RGl2bTU2Z3l4MGZNR1ZZREpyajlNaXZFMElZMkNCNENKRHNCMCtyVTBrbz0tLXdVODl3TlRJejA1MWpiTzYzaTBsZ1E9PQ==--8eb0b38bd782e0145dc4dc01e093c861828dbfa8)
[![npm version](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-interface.svg)](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-interface)

`@ideal-postcodes/core-interface` is an environment agnostic implementation of the Ideal Postcodes javascript API client interface.

If you are looking for a browser or node.js client, please check out the downstream clients in the [links](#links) below.

## Links

- [API Documentation](https://core-interface.ideal-postcodes.co.uk/)
- [NPM Module](https://www.npmjs.com/package/@ideal-postcodes/core-interface)
- [Github Repository](https://github.com/ideal-postcodes/core-interface)
- [Browser Client Repository](https://github.com/ideal-postcodes/core-browser) 
- [Node.js Client](https://github.com/ideal-postcodes/core-node)
- [Typings Repository](https://github.com/ideal-postcodes/api-typings)
- [Fixtures Repository](https://github.com/ideal-postcodes/api-fixtures)

## Documentation

### Methods

#### Usage

To install, pick one of the following based on your platform

```bash
# For browser client
npm install @ideal-postcodes/core-browser

# For node.js client
npm install @ideal-postcodes/core-node

# For generic interface (you need to supply your own HTTP agent)
npm install @ideal-postcodes/core-interface
```

Instantiate a client

```javascript
const client = new Client({});
```

More configuration options [outlined in the docs](https://core-interface.ideal-postcodes.dev/docs/interfaces/config.html)

#### Resource Methods

Resources defined in [the API documentation](https://ideal-postcodes.co.uk/documentation) are exposed on the client. Each resource exposes a method (`#retrieve`, `#list`, etc) which maps to a resource action.

These methods expose a low level interface to execute HTTP requests and observe HTTP responses. They are ideal if you have a more complex query or usecase where low level access would be useful.

Resource methods return a promise with a HTTP response object type.

Requesting a resource by ID (e.g. a postcode lookup for postcode with ID "SW1A 2AA") maps to the `#retrieve` method.

The first argument is the resource ID. The second argument is an object which accepts `header` and `query` attributes that map to HTTP header and the request querystring.

```javascript
client.resourceName.retrieve("id", {
  query: {
    api_key: "foo",
    tags: "this,that,those",
    licensee: "sk_99dj3",
  },
  header: {
    "IDPC-Source-IP": "8.8.8.8",
  },
  timeout: 5000,
});
```

Reqesting a resource endpoint (e.g. an address query to `/addresses`) maps to the `#list` method.

```javascript
client.resourceName.list({
  query: {
    api_key: "foo",
    query: "10 downing street"
  },
  header: {
    "IDPC-Source-IP": "8.8.8.8",
  },
  timeout: 5000,
});
```

The first and only argument is an object which accepts `header` and `query` attributes that map to HTTP header and the request querystring.

The resources are:

- [Postcodes](#postcodes)
- [Addresses](#addresses)
- [Autocomplete](#autocomplete)
- [UDPRN](#udprn)
- [UMPRN](#umprn)
- [Keys](#keys)

#### Postcodes

Retrieve addresses for a postcode.

```javascript
client.postcodes.retrieve("SW1A2AA", {
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const addresses = response.body.result;
}).catch(error => logger(error));
```

[See Postcode resource API documentation](https://ideal-postcodes.co.uk/documentation/postcodes)


#### Addresses

Search for an address.

```javascript
client.addresses.list({
  query: {
    query: "10 Downing street",
  },
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const addresses = response.body.result.hits;
}).catch(error => logger(error));
```

[See addresses resource API documentation](https://ideal-postcodes.co.uk/documentation/addresses)

#### Autocomplete

Autocomplete an address given an address partial.

```javascript
client.autocomplete.list({
  query: {
    query: "10 Downing stre",
  },
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const suggestions = response.body.result.hits;
}).catch(error => logger(error));
```

[See autocomplete resource API documentation](https://ideal-postcodes.co.uk/documentation/autocomplete)

#### UDPRN

Retrieve an address given a UDPRN

```javascript
client.udprn.retrieve("12345678", {
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const address = response.body.result;
}).catch(error => logger(error));
```

[See UDPRN resource API documentation](https://ideal-postcodes.co.uk/documentation/udprn)

#### UMPRN

Retrieve a multiple residence premise given a UMPRN.

```javascript
client.umprn.retrieve("87654321", {
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const address = response.body.result;
}).catch(error => logger(error));
```

[See UMPRN resource API documentation](https://ideal-postcodes.co.uk/documentation/umprn)

#### Keys

Find out if a key is available.

```javascript
client.keys.retrieve("iddqd", {})
  .then(response => {
    const { available } = response.body.result;
  }).catch(error => logger(error));
```

Get private information on key (requires user_token).

```javascript
client.keys.retrieve("iddqd", {
  header: {
    "Authorization": 'IDEALPOSTCODES user_token="secret-token"',
  },
}).then(response => {
  const key = response.body.result;
}).catch(error => logger(error));
```

Get key usage data.

```javascript
client.keys.usage("iddqd", {
  header: {
    "Authorization": 'IDEALPOSTCODES user_token="secret-token"',
  },
}).then(response => {
  const key = response.body.result;
}).catch(error => logger(error));
```

[See Keys resource API documentation](https://ideal-postcodes.co.uk/documentation/keys)

### Errors

For more advanced use cases, this library also exports:

- Class implementations for Ideal Postcodes API errors that inherit from `Error`
- A parser that converts raw error data into an error instance

#### Usage

Aside from inspecting the HTTP request status code and/or JSON body response codes, you may also test for specific error instances.

Errors that don't inherit from `IdealPostcodesError` would indicate some kind of error external to the API (e.g. bad network, request timeout).

```javascript
import { errors } from "@ideal-postcodes/core-interface";
const { IdpcPostcodeNotFoundError } = errors;

// Handle a specific error
if (error instanceof IdpcPostcodeNotFoundError) {
  // You got yourself an invalid API Key
}

// Alternatively use a switch statement
switch (true) {
  case error instanceof IdpcPostcodeNotFoundError:
    // You got yourself an invalid API Key
  default:
    // Default error handling path
}
```

#### Error Prototype Chain

All errors inherit from Javascript's `Error` prototype.

Errors are grouped by HTTP status code classes.

Specific errors may be supplied for the following reasons: 
- Convenience: They are frequently tested for (e.g. invalid postcode, postcode not found)
- Deverloper QoL. They are useful for debug purposes during the implementation stages

```
Prototype Chain

# Parent class inherits from Javascript Error. Returned if no JSON Response body
IdealPostcodesError < Error
|
|- IdpcApiError # Generic Error Class, returned if JSON response body present
   |
   |- IdpcBadRequestError          # 400 Errors
   |- IdpcUnauthorisedError        # 401 Errors
   |- IdpcRequestFailedError       # 402 Errors
   |
   |- IdpcResourceNotFoundError    # 404 Errors
   |  |- IdpcPostcodeNotFoundError
   |  |- IdpcKeyNotFoundError
   |  |- IdpcUdprnNotFoundError
   |  |- IdpcUmprnNotFoundError
   |
   |- IdpcServerError              # 500 Errors

```

#### Error Parser

Errors consume a HTTP API response

```javascript
import { errors } from "@ideal-postcodes/core-interface";
const { parse, IdpcPostcodeNotFoundError } = errors;

const invalidPostcodeUrl = "https://api.ideal-postcodes.co.uk/v1/postcodes/bad_postcode?api_key=iddqd"

const response = await fetch(invalidPostcodeUrl);

// Generate an error object if present, otherwise returns `undefined`
const error = parse(response);

// Handle the error
if (error instanceof IdpcPostcodeNotFoundError) ...
```

## Test

```bash
npm test
```

## License

MIT
