# [3.0.0](https://github.com/ideal-postcodes/core-interface/compare/2.0.3...3.0.0) (2022-02-14)


### Features

* **OpenAPI:** Migrate from api-typings to openapi spec ([62c41b2](https://github.com/ideal-postcodes/core-interface/commit/62c41b24a3064f68a5c7216fdc9953ca71d68c27))
* **Resolve:** Resolve address suggestions ([3c1ad61](https://github.com/ideal-postcodes/core-interface/commit/3c1ad612787ec54a4066c09763aa77f11c0a7da1))


### BREAKING CHANGES

* **OpenAPI:** Core-Interface typings now uses
@ideal-postcodes/openapi

# [3.0.0-beta.1](https://github.com/ideal-postcodes/core-interface/compare/2.0.3...3.0.0-beta.1) (2022-02-03)


### Features

* **OpenAPI:** Migrate from api-typings to openapi spec ([06ce31d](https://github.com/ideal-postcodes/core-interface/commit/06ce31d6de53b65837fbb30ba44f88d343c51c90))
* **Resolve:** Resolve address suggestions ([c2cfef7](https://github.com/ideal-postcodes/core-interface/commit/c2cfef7ee4fcc5ec8a66989278f4ab5dbf778723))


### BREAKING CHANGES

* **OpenAPI:** Core-Interface typings now uses
@ideal-postcodes/openapi

## [2.0.3](https://github.com/ideal-postcodes/core-interface/compare/2.0.2...2.0.3) (2021-07-23)


### Bug Fixes

* **ESM:** Pin target output to ES2020 ([78a8b74](https://github.com/ideal-postcodes/core-interface/commit/78a8b7464290710b69bb9d9abbff5413cfc7dca6))

## [2.0.2](https://github.com/ideal-postcodes/core-interface/compare/2.0.1...2.0.2) (2021-07-19)


### Bug Fixes

* **Exports:** Drop namespaced exports ([9717306](https://github.com/ideal-postcodes/core-interface/commit/9717306545d6f61cd15ad7ea313727b3f3fd0446))
* **Typings:** Move into dependencies ([8caef68](https://github.com/ideal-postcodes/core-interface/commit/8caef684af0fbfdcc705efc541625d1b55ac3f21))

## [2.0.1](https://github.com/ideal-postcodes/core-interface/compare/2.0.0...2.0.1) (2021-06-04)


### Bug Fixes

* **Client Typings:** Make all but api_key config optional ([716cba1](https://github.com/ideal-postcodes/core-interface/commit/716cba155e4091450abfa82129ac938d61a32edd))

# [2.0.0](https://github.com/ideal-postcodes/core-interface/compare/1.9.0...2.0.0) (2021-06-04)


### Code Refactoring

* **Defaults:** Export `defaults` object ([6b9b698](https://github.com/ideal-postcodes/core-interface/commit/6b9b6981abd517061621436a2afef0f4f62cddb7))


### Features

* **Version 2:** Reduce package size ([cfcae8a](https://github.com/ideal-postcodes/core-interface/commit/cfcae8a7087708820ec0ca1b2d97df3dabd056f5))


### BREAKING CHANGES

* **Version 2:** - Package now exports a `defaults` object
- Client.defaults has been removed
- All client config is now stored in `client.config`
- All resources have been removed from the client. Instead retrieve
these from the library and inject the client. E.g.
`client.postcodes.retrieve` becomes `postcodes.retrieve(client, ...)`
- Helper methods (like lookupPostcode, ping) have been removed from the client.
Instead retrieve these from teh library and inject the client. E.g.
`client.lookupPostcode` becomes `lookupPostcode(client, ...)`
* **Defaults:** Uppercased default variables no longer exported.
Instead `defaults` object is supplied

# [1.9.0](https://github.com/ideal-postcodes/core-interface/compare/1.8.1...1.9.0) (2021-01-15)


### Features

* **Tagging:** Allow tags to be set by client ([5f40c0f](https://github.com/ideal-postcodes/core-interface/commit/5f40c0f98c8a19b46525d0c29aa9e37a339cf747))

## [1.8.1](https://github.com/ideal-postcodes/core-interface/compare/1.8.0...1.8.1) (2020-11-27)


### Bug Fixes

* **tsconfig:** Bump tsconfig ([37504cd](https://github.com/ideal-postcodes/core-interface/commit/37504cdc2e4ecf6a610d672bce60cfdbb61a2e86))

# [1.8.0](https://github.com/ideal-postcodes/core-interface/compare/1.7.0...1.8.0) (2020-10-22)


### Features

* **ESM:** Target ESNext in ESM builds ([d44f960](https://github.com/ideal-postcodes/core-interface/commit/d44f960b314a89881b6afd67f9c8f44cc0a7621a))

# [1.7.0](https://github.com/ideal-postcodes/core-interface/compare/1.6.0...1.7.0) (2020-10-21)


### Features

* **ESM:** Publish ESM build ([acf45bb](https://github.com/ideal-postcodes/core-interface/commit/acf45bbac2f4f0b3872115289e1d35071991abae))

# [1.6.0](https://github.com/ideal-postcodes/core-interface/compare/1.5.0...1.6.0) (2020-07-27)


### Features

* **Query:** Allow non-string query attributes ([2de56cb](https://github.com/ideal-postcodes/core-interface/commit/2de56cb1905e04b6376e5a2a4dc52a9b65aff7be))

# [1.5.0](https://github.com/ideal-postcodes/core-interface/compare/1.4.0...1.5.0) (2020-02-05)


### Features

* **Keys:** Add ability to check licensee ([46d1cd6](https://github.com/ideal-postcodes/core-interface/commit/46d1cd63894d37f727ade827cb1a273fab3e3cf8))

# [1.4.0](https://github.com/ideal-postcodes/core-interface/compare/1.3.0...1.4.0) (2019-12-06)


### Bug Fixes

* **Browser Tests:** Migrate to SL ([2b96ae5](https://github.com/ideal-postcodes/core-interface/commit/2b96ae5))
* **README:** Check against Markdown lint rules and correct grammar ([b210165](https://github.com/ideal-postcodes/core-interface/commit/b210165))


### Features

* **Autocomplete:** Expose autocomplete resource ([b386ce0](https://github.com/ideal-postcodes/core-interface/commit/b386ce0))

# [1.3.0](https://github.com/ideal-postcodes/core-interface/compare/1.2.0...1.3.0) (2019-06-09)


### Features

* **Error:** Add specific 402 errors ([270cfed](https://github.com/ideal-postcodes/core-interface/commit/270cfed))
* **Error:** Allow optional metadata attribute ([9d082a7](https://github.com/ideal-postcodes/core-interface/commit/9d082a7))

# [1.2.0](https://github.com/ideal-postcodes/core-interface/compare/1.1.1...1.2.0) (2019-06-07)


### Bug Fixes

* **Karma-Typescript:** Explicitly exclude typings module ([b11e9e3](https://github.com/ideal-postcodes/core-interface/commit/b11e9e3))


### Features

* **Client#checkKeyUsability:** Implement key check ([df6a611](https://github.com/ideal-postcodes/core-interface/commit/df6a611))
* **Client#lookupAddress:** Implement address lookup ([a53fb67](https://github.com/ideal-postcodes/core-interface/commit/a53fb67))
* **Client#lookupPostcode:** Implement and document postcode lookup ([21e591e](https://github.com/ideal-postcodes/core-interface/commit/21e591e))
* **Client#lookupPostcode:** Make results paginateable ([a155f9f](https://github.com/ideal-postcodes/core-interface/commit/a155f9f))
* **Client#lookupUdprn:** Implement and document udprn search ([e709853](https://github.com/ideal-postcodes/core-interface/commit/e709853))
* **Client#lookupUmprn:** Implement UMPRN lookup ([14227c3](https://github.com/ideal-postcodes/core-interface/commit/14227c3))
* **Error:** Export errors on Client ([ff111f0](https://github.com/ideal-postcodes/core-interface/commit/ff111f0))

## [1.1.1](https://github.com/ideal-postcodes/core-interface/compare/1.1.0...1.1.1) (2019-06-06)


### Bug Fixes

* **Karma-Typescript:** Explicitly exclude typings module ([ff40c04](https://github.com/ideal-postcodes/core-interface/commit/ff40c04))

## [1.1.1](https://github.com/ideal-postcodes/core-interface/compare/1.1.0...1.1.1) (2019-06-06)


### Bug Fixes

* **Karma-Typescript:** Explicitly exclude typings module ([ff40c04](https://github.com/ideal-postcodes/core-interface/commit/ff40c04))

# [1.1.0](https://github.com/ideal-postcodes/core-interface/compare/1.0.0...1.1.0) (2019-06-05)


### Bug Fixes

* **Resource:** Escape ID by default ([b94d4f3](https://github.com/ideal-postcodes/core-interface/commit/b94d4f3))


### Features

* **Client:** Export client config ([8dd2a37](https://github.com/ideal-postcodes/core-interface/commit/8dd2a37))

# 1.0.0 (2019-06-04)


### Bug Fixes

* **Error:** Invalid keys should return authorisation error ([6bea2fb](https://github.com/ideal-postcodes/core-interface/commit/6bea2fb))


### Features

* **Addresses:** Implement addresses resource ([a37f907](https://github.com/ideal-postcodes/core-interface/commit/a37f907))
* **Addresses:** Implement autocomplete ([d6f940e](https://github.com/ideal-postcodes/core-interface/commit/d6f940e))
* **Keys:** Implement keys usage method ([e005900](https://github.com/ideal-postcodes/core-interface/commit/e005900))
* **Keys:** Implement keys.retrieve ([d7710f7](https://github.com/ideal-postcodes/core-interface/commit/d7710f7))
* **Semantic Release:** Automate git and npm releases ([13b56a7](https://github.com/ideal-postcodes/core-interface/commit/13b56a7))
* **UDPRN:** Add udprn resource ([e7c4e0f](https://github.com/ideal-postcodes/core-interface/commit/e7c4e0f))
* **UMPRN:** Implement UMPRN resource ([efd6a7a](https://github.com/ideal-postcodes/core-interface/commit/efd6a7a))
