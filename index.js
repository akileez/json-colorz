/*!
 * json-colorz <https://github.com/akileez/json-colorz>
 *
 * Copyright (c) 2015 Keith Williams.
 * Licensed under the ISC license.
 */

var clrz = require('colorz')

var data = {
  global: {
    colored : true,
    async   : false
  },
  colors: {
    num     : "cyan",
    str     : "magenta",
    bool    : "red",
    undef   : "grey",
    null    : "grey",
    attr    : "green",
    quot    : "magenta",
    punc    : "yellow",
    brack   : "yellow"
  },
  level: {
    show    : false,
    char    : ".",
    color   : "yellow",
    spaces  : 4
  }
}

var colors = data.colors
var level = data.level
var global = data.global

function generateColors (value, type) {
  if (!global.colored) return value
  if (type) return c(value, colors[type])
  if ((''+value) == 'null') return c('null', colors.null)
  if ((''+value) == 'undefined') return c('undefined', colors.undef)

  switch (kindOf(value)) {
    case 'number' : return c(value.toString(), colors.num)
    case 'string' : return [c('"', colors.quot), c(value, colors.str), c('"', colors.quot)].join('')
    case 'boolean' : return c(value.toString(), colors.bool)
    case 'function' : return c('null', colors.null)
    case 'array' :
      var log = c('[', colors.brack)
      var i = -1
      var len = value.length
      while (++i < len) {
        log += generateColors(value[i])
        if (i < value.length - 1) log += c(', ', colors.punc)
      }
      log += c(']', colors.brack)
      return log
  }
}

function getTabs (lvl) {
  var tabs = ''
  var spaces = ' '
  var i = -1
  while (spaces.length < level.spaces) {
    spaces += ' '
  }
  while (++i < lvl) {
    tabs += ((level.show) ? c(level.char, level.color) : '') + spaces
  }
  return tabs
}

function hasChilds (array) {
  var i = -1
  var len = array.length
  while (++i < len) {
    if (kindOf(array[i]) === 'array' || kindOf(array[i]) === 'object') return true
  }
  return false
}

function clearObject (json) {
  var len = 0
  for (var key in json) {
    if (json.hasOwnProperty(key) && kindOf(json[key] !== 'function')) len ++
    else delete json[key]
  }
  return len
}

function clearArray (json) {
  for (var key in json) {
    if (kindOf(json[key]) === 'function') json[key] = null
  }
  return json.length
}

function isEmpty (elem) {
  for (key in elem) {
    return false
  }
  return true
}

function kindOf (value) {
  return typeof value === 'object'
    ? Object.prototype.toString.call(value).replace(/^\[object |\]$/g,'').toLowerCase()
    : typeof value
}

function c (str, prop) {
  return clrz[prop](str)
}

function jsonColorize (json, lvl, inObj) {
  var level = lvl ? lvl : 0
  var result = ''
  if (kindOf(json) === 'object') {
    var len = clearObject(json)
    if (isEmpty(json)) return getTabs(level) + generateColors('{}', 'brack')

    result += getTabs(inObj ? 0 : level) + generateColors('{\n', 'brack')

    for (key in json) {
      len --
      if (kindOf(json[key]) === 'object' || kindOf(json[key]) === 'array') {
        result += getTabs(level +1)
          + generateColors(key, 'attr')
          + generateColors(': ', 'punc')
          + jsonColorize(json[key], level + 1, true)
          + generateColors((len ? ', ' : '') + '\n', 'punc')
      } else {
        result += getTabs(level + 1)
          + generateColors(key, 'attr')
          + generateColors(': ', 'punc')
          + generateColors(json[key])
          + generateColors((len ? ', ' : '') + '\n', 'punc')
      }
    }

    result += getTabs(level) + generateColors('}', 'brack')

  } else if (kindOf(json) === 'array' && hasChilds(json)) {
    if (isEmpty(json)) return getTabs(level) + generateColors('[]', 'brack')

    result += getTabs(inObj ? 0 : level) + generateColors('[\n', 'brack')

    var len = clearArray(json)
    for (key in json) {
      len --
      if (kindOf(json[key]) === 'object' || kindOf(json[key]) === 'array') {
        result += jsonColorize(json[key], level + 1) + generateColors((len ? ', ' : '') + '\n', 'punc')
      } else {
        result += getTabs(level + 1)
          + generateColors(json[key])
          + generateColors((len ? ', ' : '') + '\n', 'punc')
      }
    }

    result += getTabs(level) + generateColors(']', 'brack')

  } else {
    result += getTabs(inObj ? 0 : level) + generateColors(json)
  }

  return result
}

function service (json, func) {
  // if (global.async) {
  //   jsonColorize.than(json, function (data) {
  //     console.log
  //   })
  // }
  console.log(jsonColorize(json))
}

service.parse = function (json) {
  this(JSON.parse(json))
}
service.colors = colors
service.level = level
service.global = global

module.exports = service
