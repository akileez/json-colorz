var colorz = require('colorz')

function engine () {
  var options

  function kindOf (value) {
    return typeof value === 'object'
      ? toString.call(value)
      : typeof value
  }

  function isObject (obj) {
    return toString.call(obj) === '[object Object]'
  }

  function filter (arr, fn) {
    var result = []

    var val
    var i = -1
    var j = -1
    var len = arr.length

    while (++i < len) {
      val = arr[i]
      if (fn(val, i, arr)) result[++j] = val
    }
    return result
  }

  function repeat (str, n) {
    var result = ''

    while (n > 0) {
      if (n % 2) result += str
      n = Math.floor(n / 2)
      str += str
    }
    return result
  }

  function getType (value) {
    var map = {
      'number'          : 'num',
      'string'          : 'str',
      'boolean'         : 'bool',
      'function'        : 'func',
      'null'            : 'null',
      'undefined'       : 'undef',
      '[object RegExp]' : 'regex',
    }
    return map[kindOf(value)] || map['' + value]
  }

  function cleanObject (obj) {
    var lastKey = ''
    var key

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        (getType(obj[key]) === 'func') && delete obj[key] || (lastKey = key)
      }
    }
    return lastKey
  }

  function cleanArray (arr) {
    return filter(arr, function (item) {
      return getType(item) !== 'func'
    })
  }

  function generateLevel (level) {
    var levelStr = repeat(' ', options.level.spaces)
    var opts = options.level

    if (options.level.show && levelStr.length) {
      levelStr = levelStr.replace(' ', opts.char[opts.color])
    }
    return repeat(levelStr, level)
  }

  function hasChild (obj) {
    var key
    for (key in obj) {
      if (Array.isArray(obj[key]) || isObject(obj[key])) return true
    }
  }

  function colorify (value, level) {
    var color = options.colors[getType(value)]
    return generateLevel(level)
      + (getType(value) === 'str' ? colorifySpec('"', 'quot') : '')
      + useColorProvider('' + value, color)
      + (getType(value) === 'str' ? colorifySpec('"', 'quot') : '')
  }

  function colorifySpec (char, type, level) {
    return generateLevel(level) + useColorProvider('' + char, options.colors[type])
  }

  function useColorProvider (str, color) {
    if (options.params.colored) {
      if (Array.isArray(color) && color.length > 1) {
        return useColorProvider(colorz[color[0]](str), color.slice(1))
      } else {
        return colorz[Array.isArray(color) ? color[0] : color](str)
      }
    }
    return str
  }

  return {
    gen: function (json, level, isChild) {
      var colored = ''

      level = level || 0

      if (isObject(json)) {
        var lastKey = cleanObject(json)
        colored += colorifySpec('{', 'brack', isChild ? 0 : level) + '\n'
        level++

        for (var key in json) {
          var result = colorifySpec(key, 'attr', level)
            + colorifySpec(': ', 'punc')
            + this.gen(json[key], level, true)
            + (key !== lastKey ? colorifySpec(',', 'punc') : '')

          colored += result + '\n'
        }

        colored += colorifySpec('}', 'brack', --level)
      } else if (Array.isArray(json)) {
        json = cleanArray(json)

        if (hasChild(json)) {
          var result = json.map(function (item) {
            return this.gen(item, level + 1)
          }.bind(this))

          colored += colorifySpec('[', 'brack', isChild ? 0 : level)
          colored += result.join(colorifySpec(', ', 'punc') + '\n')
          colored += colorifySpec(']', 'brack', level)
        } else {
          var coloredArray = colorifySpec('[', 'brack', isChild ? 0 : level)

          for (var key in json) {
            coloredArray += colorify(json[key]) + (json.length - 1 > key ? colorifySpec(', ', 'punc') : '')
          }

          colored += coloredArray + colorifySpec(']', 'brack')
        }
      } else {
        return generateLevel(isChild ? 0 : level) + colorify(json)
      }

      return colored
    },

    setOptions: function (opts) {
      options = opts
      return this
    }
  }
}

module.exports = engine()
