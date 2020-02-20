<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Ideal%20Postcodes%20Core%20Logo@3x.png" alt="Ideal Postcodes Core Interface">
</h1>

> JavaScript API for api.ideal-postcodes.co.uk

[![CircleCI](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master.svg?style=svg)](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master)
![Cross Browser Testing](https://github.com/ideal-postcodes/core-interface/workflows/Cross%20Browser%20Testing/badge.svg?branch=saucelabs)
[![Release](https://github.com/ideal-postcodes/core-interface/workflows/Release/badge.svg)](https://github.com/ideal-postcodes/core-interface/actions)
[![codecov](https://codecov.io/gh/ideal-postcodes/core-interface/branch/master/graph/badge.svg)](https://codecov.io/gh/ideal-postcodes/core-interface)
![Dependency Status](https://david-dm.org/ideal-postcodes/core-interface.svg)

[![npm version](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-interface.svg)](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-interface)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@ideal-postcodes/core-interface.svg?color=%234c1&style=popout)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@ideal-postcodes/core-interface.svg?color=%234c1&style=popout)
[![install size](https://packagephobia.now.sh/badge?p=@ideal-postcodes/core-interface)](https://packagephobia.now.sh/result?p=@ideal-postcodes/core-interface)

`@ideal-postcodes/core-interface` is an environment agnostic implementation of the Ideal Postcodes JavaScript API client interface.

If you are looking for the browser or Node.js client which implements this interface, please check out the [downstream clients links](#downstream-clients).

## Links

- [API Documentation](https://core-interface.ideal-postcodes.dev/)
- [npm Module](https://www.npmjs.com/package/@ideal-postcodes/core-interface)
- [GitHub Repository](https://github.com/ideal-postcodes/core-interface)
- [Typings Repository](https://github.com/ideal-postcodes/api-typings)
- [Fixtures Repository](https://github.com/ideal-postcodes/api-fixtures)

## Downstream Clients

- [Browser Client Repository](https://github.com/ideal-postcodes/core-browser)
- [Bundled Browser Client Repository](https://github.com/ideal-postcodes/core-browser-bundled)
- [Node.js Client Repository](https://github.com/ideal-postcodes/core-node)
- [Axios-backed Client Repository](https://github.com/ideal-postcodes/core-axios)

## Documentation

- [Usage & Configuration](#usage)
- [Quick Methods](#quick-methods)
- [Resource Methods](#resource-methods)
- [Error Handling](#error-handling)

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

Instantiate a client with

```javascript
import { Client } from "@ideal-postcodes/core-<package-type>";

const client = new Client({ api_key: "iddqd" });

// Only api_key is required by core-node and core-browser - all others are optional
// The agentless interface requires explicit configuration
```

[Client class docs](https://core-interface.ideal-postcodes.dev/classes/client.html)

[Client configuration options](https://core-interface.ideal-postcodes.dev/interfaces/config.html)

---

#### Quick Methods

The client exposes a number of simple methods to get at the most common tasks when interacting with the API

- [Lookup a Postcode](#lookup-a-postcode)
- [Search for an Address](#search-for-an-address)
- [Search for an Address by UDPRN](#search-for-an-address-by-udprn)
- [Search for an Address by UMPRN](#search-for-an-address-by-umprn)
- [Check Key Usability](#check-key-usability)

#### Lookup a Postcode

Return addresses associated with a given `postcode`

Invalid postcodes (i.e. postcode not found) return an empty array `[]`

```javascript
const postcode = "id11qd";

client.lookupPostcode({ postcode }).then(addresses => {
  console.log(addresses);
  {
    postcode: "ID1 1QD",
    line_1: "2 Barons Court Road",
    // ...etc...
  }
});
```

[`client.lookupPostcode` docs](https://core-interface.ideal-postcodes.dev/classes/client.html#lookuppostcode)

[`client.lookupPostcode` options](https://core-interface.ideal-postcodes.dev/interfaces/lookuppostcodeoptions.html)

#### Search for an Address

Return addresses associated with a given `query`

```javascript
const query = "10 downing street sw1a";

client.lookupAddress({ query }).then(addresses => {
  console.log(addresses);
  {
    postcode: "SW1A 2AA",
    line_1: "Prime Minister & First Lord Of The Treasury",
    // ...etc...
  }
});
```

[`client.lookupAddress` docs](https://core-interface.ideal-postcodes.dev/classes/client.html#lookupaddress)

[`client.lookupAddress` options](https://core-interface.ideal-postcodes.dev/interfaces/lookupaddressoptions.html)

#### Search for an Address by UDPRN

Return address for a given `udprn`

Invalid UDPRN will return `null`

```javascript
const udprn = 23747771;

client.lookupUdprn({ udprn }).then(address => {
  console.log(address);
  {
    postcode: "SW1A 2AA",
    line_1: "Prime Minister & First Lord Of The Treasury",
    // ...etc...
  }
});
```

[`client.lookupUdprn` docs](https://core-interface.ideal-postcodes.dev/classes/client.html#lookupudprn)

[`client.lookupUdprn` options](https://core-interface.ideal-postcodes.dev/interfaces/lookupudprnoptions.html)

#### Search for an Address by UMPRN

Return address for a given `umprn`

Invalid UMPRN will return `null`

```javascript
const umprn = 50906066;

client.lookupUmprn({ umprn }).then(address => {
  console.log(address);
  {
    postcode: "CV4 7AL",
    line_1: "Room 1, Block 1 Arthur Vick",
    // ...etc...
  }
});
```

[`client.lookupUmprn` docs](https://core-interface.ideal-postcodes.dev/classes/client.html#lookupumprn)

[`client.lookupUmprn` options](https://core-interface.ideal-postcodes.dev/interfaces/lookupumprnoptions.html)

#### Check Key Usability

Check if a key is currently usable

```javascript
client.checkKeyUsability({}).then(key => {
  console.log(key.available); // => true
});
```

[`client.checkKeyUsability` docs](https://core-interface.ideal-postcodes.dev/classes/client.html#checkkeyusability)

[`client.checkKeyUsability` options](https://core-interface.ideal-postcodes.dev/interfaces/checkkeyusabilityoptions.html)

---

#### Resources

Resources defined in [the API documentation](https://ideal-postcodes.co.uk/documentation) are exposed on the client. Each resource exposes a method (`#retrieve`, `#list`, etc) which maps to a resource action.

These methods expose a low level interface to execute HTTP requests and observe HTTP responses. They are ideal if you have a more complex query or usecase where low level access would be useful.

Resource methods return a promise with a [HTTP response object type](https://core-interface.ideal-postcodes.dev/interfaces/httpresponse.html).

#### Retrieve

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

#### List

Requesting a resource endpoint (e.g. an address query to `/addresses`) maps to the `#list` method.

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

#### Custom Actions

Some endpoints are defined as custom actions, e.g. `/keys/:key/usage`. These can be invoked using the name of the custom action.

E.g. for [key usage data extraction](https://ideal-postcodes.co.uk/documentation/keys#usage)

```javascript
client.keys.usage(api_key, {
  query: {
    tags: "checkout,production"
  },
  header: {
    Authorization: 'IDEALPOSTCODES user_token="foo"',
  },
  timeout: 5000,
});
```

---

#### Resource Methods

Listed below are the available resources exposed by the client:

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

[Postcode resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/postcodes)

[Postcode resource docs](https://core-interface.ideal-postcodes.dev/interfaces/postcoderesource.html)

#### Addresses

Search for an address

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

[Address resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/addresses)

[Address resource client docs](https://core-interface.ideal-postcodes.dev/interfaces/addressresource.html)

#### Autocomplete

Autocomplete an address given an address partial

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

[Autocomplete resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/autocomplete)

[Autocomplete resource client docs](https://core-interface.ideal-postcodes.dev/interfaces/autocompleteresource.html)

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

[UDPRN resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/udprn)

[UDPRN resource client docs](https://core-interface.ideal-postcodes.dev/interfaces/udprnresource.html)

#### UMPRN

Retrieve a multiple residence premise given a UMPRN

```javascript
client.umprn.retrieve("87654321", {
  header: {
    "Authorization": 'IDEALPOSTCODES api_key="iddqd"',
  },
}).then(response => {
  const address = response.body.result;
}).catch(error => logger(error));
```

[UMPRN resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/umprn)

[UMPRN resource client docs](https://core-interface.ideal-postcodes.dev/interfaces/umprnresource.html)

#### Keys

Find out if a key is available

```javascript
client.keys.retrieve("iddqd", {})
  .then(response => {
    const { available } = response.body.result;
  }).catch(error => logger(error));
```

[Method docs](https://core-interface.ideal-postcodes.dev/interfaces/keyresource.html#retrieve)

Get private information on key (requires user_token)

```javascript
client.keys.retrieve("iddqd", {
  header: {
    "Authorization": 'IDEALPOSTCODES user_token="secret-token"',
  },
}).then(response => {
  const key = response.body.result;
}).catch(error => logger(error));
```

[Method docs](https://core-interface.ideal-postcodes.dev/interfaces/keyresource.html#retrieve)

Get key usage data

```javascript
client.keys.usage("iddqd", {
  header: {
    "Authorization": 'IDEALPOSTCODES user_token="secret-token"',
  },
}).then(response => {
  const key = response.body.result;
}).catch(error => logger(error));
```

[Method docs](https://core-interface.ideal-postcodes.dev/interfaces/keyresource.html#usage)

[Keys resource HTTP API documentation](https://ideal-postcodes.co.uk/documentation/keys)

[Key resource client docs](https://core-interface.ideal-postcodes.dev/interfaces/keyresource.html)

---

#### Error Handling

`Client` exports a static variable `errors` which contains custom error constructors that wrap specific API errors. These constructors can be used to test for specific cases using the `instanceof` operator.

For example:

```javascript
const { IdpcInvalidKeyError } = Client.errors;

try {
  const addresses = client.lookupPostcode({ postcode: "SW1A2AA" });
} catch (error) {
  if (error instanceof IdpcInvalidKeyError) {
    // Handle an invalid key error
  }
}
```

Not all specific API errors will be caught. If a specific API error does not have an error constructor defined, a more generic error (determined by the HTTP status code) will be returned.

For example:

```javascript
const { IdpcRequestFailedError } = Client.errors;

try {
  const addresses = client.lookupPostcode({ postcode: "SW1A2AA" });
} catch (error) {
  if (error instanceof IdpcRequestFailedError) {
    // IdpcRequestFailedError indicates a 402 response code
    // Possibly the key balance has been depleted
  }
}
```

A sketch of the error prototype chain can be found [here](#error-prototype-chain)

---

### Core Interface Errors

For more advanced use cases, this core-interface library provides:

- Class implementations for [Ideal Postcodes API errors](https://core-interface.ideal-postcodes.dev/classes/idpcapierror.html) that inherit from `Error`
- A [parser](https://core-interface.ideal-postcodes.dev/globals.html#parse) that converts raw error data into one of these error instances

#### Usage

Aside from inspecting the HTTP request status code and/or JSON body response codes, you may also test for specific error instances.

Errors that don't inherit from [`IdealPostcodesError`](https://core-interface.ideal-postcodes.dev/classes/idealpostcodeserror.html) would indicate some kind of error external to the API (e.g. bad network, request timeout).

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

All errors inherit from JavaScript's `Error` prototype.

Errors are grouped by HTTP status code classes.

Specific errors may be supplied for the following reasons:

- Convenience: They are frequently tested for (e.g. invalid postcode, postcode not found)
- Developer QoL. They are useful for debug purposes during the implementation stages

```javascript
Prototype Chain

# Parent class inherits from Javascript Error. Returned if no JSON Response body
IdealPostcodesError < Error
|
|- IdpcApiError # Generic Error Class, returned if JSON response body present
   |
   |- IdpcBadRequestError          # 400 Errors
   |- IdpcUnauthorisedError        # 401 Errors
   |- IdpcRequestFailedError       # 402 Errors
   |  |- IdpcBalanceDepletedError
   |  |- IdpcLimitReachedError
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

The error parser consumes a HTTP API response and returns the correct error instance.

```javascript
import { errors } from "@ideal-postcodes/core-interface";
const { parse, IdpcPostcodeNotFoundError } = errors;

const invalidPostcodeUrl = "https://api.ideal-postcodes.co.uk/v1/postcodes/bad_postcode?api_key=iddqd"

const response = await fetch(invalidPostcodeUrl);

// Generate an error object if present, otherwise returns `undefined`
const error = parse(response);

// Handle the error
if (error instanceof IdpcPostcodeNotFoundError) {...}
```

## Test

```bash
npm test
```

## Licence

MIT
