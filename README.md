# json-colorz
[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![experimental][stability-image]][stability-url]
[![Downloads][downloads-image]][downloads-url]

This package allows you to display your json object on the console in a pretty format with colors.
[WIP]

## Installation
```bash
$ npm install json-colorz
```

## Usage
```js
var jlog = require('json-colorz');
jlog([{"id":1,"email":"UDawn@porta.gov","active":true},{"id":2,"email":"LZeigler@pharetra.com","active":false},{"id":3,"email":"VSobel@neque.ly","active":false}]);
```

## API
```js

```

## Why?
Jsome implements [colors](https://www.npmjs.com/package/colors) by the method of extending String.prototype. So, instead of using [colors](https://www.npmjs.com/package/colors), I wanted to use [colorz](https://www.npmjs.com/package/colorz) -- a basic ansi string substitution method for colorizing output. All credit for this code goes to Jsome author, [Khalid REHIOUI](https://www.npmjs.com/~javascript).

## See Also
- [jsome](https://www.npmjs.com/package/jsome): the awesome package json-colorz shamelessly duplicated

## License
[ISC](https://github.com/akileez/json-colorz/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/json-colorz.svg?style=flat-square
[npm-url]: https://npmjs.org/package/json-colorz
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[stability-url]: https://github.com/akileez/json-colorz
[downloads-image]: http://img.shields.io/npm/dm/json-colorz.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/json-colorz
