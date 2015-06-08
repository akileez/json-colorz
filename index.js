/*!
 * json-colorz <https://github.com/akileez/json-colorz>
 *
 * Copyright (c) 2015 Keith Williams.
 * Licensed under the ISC license.
 */
var clrz = require('colorz')
var kindOf = require('kindOf')

var data = {
  "global": {
      "colored": true,
      "async": false
  },
  "colors": {
      "num" : "cyan",
      "str" : "magenta",
      "bool"  : "red",
      "undef" : "grey",
      "null"  : "grey",
      "attr"  : "green",
      "quot"  : "magenta",
      "punc"  : "yellow",
      "brack" : "yellow"
  },
  "level": {
      "show": false,
      "char": ".",
      "color": "yellow",
      "spaces": 4
  }
}

var colors = data.colors
var level = data.level
var global = data.global

function generateColors (value, type) {
  if (!global.colored) return value
  if (type) return c(value, type) // clrz[colors[type]](value)
  if ((''+value) == 'null') return c('null', 'null')  //clrz[colors.null]('null')
  if ((''+value) == 'undefined') return c('undefined', 'undef') // clrz[colors.undef]('undefined')
  switch (kindOf(value)) {
    case 'number' : return c(value.toString(), 'num') // clrz[num](value.toString())
    case 'string' : return [c('"', 'quot'), c(value, 'str'), c('"', 'quot')].join('') // clrz[colors.quot]('"') + clrz[colors.str](value) + clrz[colors.quot]('"')
    case 'boolean' : return c(value.toString(), 'bool')
    case 'function' : return c('null', 'null')
    case 'array' :
      var log = c('[', 'brack')
      var i = -1
      var len = value.length
      while (++i < len) {
        log += generateColors(value[i])
        if (i < value.length - 1) log += c(', ', 'punc')
      }
      log += c(']', brack)
      return log
  }
}

function c (str, prop) {
  return clrz[colors[prop]](str)
}

module.exports = serve
