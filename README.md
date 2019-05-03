# Core Interface

[![CircleCI](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master.svg?style=svg)](https://circleci.com/gh/ideal-postcodes/core-interface/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/ideal-postcodes/core-interface/badge.svg?branch=master)](https://coveralls.io/github/ideal-postcodes/core-interface?branch=master)
![Dependency Status](https://david-dm.org/ideal-postcodes/core-interface.svg) 
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=RGl2bTU2Z3l4MGZNR1ZZREpyajlNaXZFMElZMkNCNENKRHNCMCtyVTBrbz0tLXdVODl3TlRJejA1MWpiTzYzaTBsZ1E9PQ==--8eb0b38bd782e0145dc4dc01e093c861828dbfa8)](https://www.browserstack.com/automate/public-build/RGl2bTU2Z3l4MGZNR1ZZREpyajlNaXZFMElZMkNCNENKRHNCMCtyVTBrbz0tLXdVODl3TlRJejA1MWpiTzYzaTBsZ1E9PQ==--8eb0b38bd782e0145dc4dc01e093c861828dbfa8)

This package is an environment agnostic implementation of the Ideal Postcodes javascript API client interface.

If you are looking for a browser or node.js client, please check out the downstream clients in the [links](#links) below.

## Links

- [API Documentation](https://core-interface.ideal-postcodes.co.uk/)
- [NPM Module](https://www.npmjs.com/package/@ideal-postcodes/core-interface)
- [Github Repository](https://github.com/ideal-postcodes/core-interface)
- [Browser Client Repository](https://github.com/ideal-postcodes/core-browser) 
- [Node.js Client](https://github.com/ideal-postcodes/core-node)
- [Typings Repository](https://github.com/ideal-postcodes/api-typings)
- [Fixtures Repository](https://github.com/ideal-postcodes/api-fixtures)

## Test

```bash
npm test
```

## Documentation

### Errors

Core Interface also exports:

- Class implementations for Ideal Postcodes API errors that inherit from javascript `Errors`
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

All errors inherit from Javascript's `Error` prototype

Errors are grouped by HTTP status code classes

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

## License

MIT
