// Credit for color codes:
// https://github.com/Marak/colors.js/blob/master/lib/styles.js


var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  url: [4, 24],
  file: [37, 39],

  number: [31, 39],
  key: [32, 39],
  string: [33, 39],
  boolean: [34, 39],
  null: [35, 39],
};



// Append/Prepend strings with color chars

function stropen (color) {
  return '\u001b[' + codes[color][0] + 'm';
}

function strclose (color) {
  return '\u001b[' + codes[color][1] + 'm';
}



// Extend the string prototype to allow for easy string coloring.
// Eg: console.log("Hello World!".green)

for (var color in codes) {
  (function (name) {
    String.prototype.__defineGetter__(name, function () {
      return stropen(name) + this + strclose(name);
    });
  })(color);
}