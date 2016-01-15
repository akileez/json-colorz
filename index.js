/*!
 * json-colorz <https://github.com/akileez/json-colorz>
 *
 * Copyright (c) 2015-2016 Keith Williams.
 * Licensed under the ISC license.
 *
 * Original Code:
 * jsome <https://github.com/Javascipt/Jsome>
 * Copyright (c) 2015 Khalid REHIOUI <Array.prototype@gmail.com> (http://github.com/javascipt)
 * Licensed under he MIT License (MIT)
 */

var colors = {
  num   : 'cyan',
  str   : 'magenta',
  bool  : 'red',
  regex : 'blue',
  undef : 'grey',
  null  : 'grey',
  attr  : 'green',
  quot  : 'yellow',
  punc  : 'yellow',
  brack : 'yellow',
  func  : 'grey'
}

var display = {
  func: false,
  date: false,
  xarr: true
}

var level = {
  show   : false,
  char   : '.',
  color  : 'red',
  spaces : 2,
  start  : 0
}

var params = {
  colored: true,
  async: false
}

var options = {
  colors : colors,
  display: display,
  level  : level,
  params : params
}

var engine = require('./lib/engine').setOptions(options)

function colorize (engine) {
  // main function: jclrz
  function jclrz (json, cb) {
    if (!jclrz.params.async) {
      process.stdout.write(engine.gen(json, options.level.start) + '\n')
    } else {
      process.nextTick(function () {
        process.stdout.write(engine.gen(json, options.level.start) + '\n')
        cb && cb()
      })
    }
    return json
  }

  // parse
  jclrz.parse = function (jsonString, cb) {
    return jclrz(JSON.parse(jsonString), cb)
  }

  // options
  jclrz.colors = colors
  jclrz.display = display
  jclrz.level = level
  jclrz.params = params

  return jclrz
}

module.exports = colorize(engine)
