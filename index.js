(function () {

  'use strict';

  var fs = require('fs');
  var mkdirp = require('mkdirp');
  var Promise = require('bluebird');
  var sanitize = require("sanitize-filename");
  require('./color.js');


  // Delete/quit WebDriver browser-session before process.exit
  // EG: You want to do any manual cleanup after failure.
  function getTheHellOutOfDodge () {
    browser.driver.quit().then(function () {

      // NOTE: To check WebDriver has quit:
      // `ps aux | grep "chromedriver\|webdriver"`

      // Exit with error code 1: quits WebDriver
      process.exit(1);
    });
  }


  // Exit keeping WebDriver & browser-session alive.
  // Eg: You want to run browser queries after test fails.
  function uglyExit () {

    // IMPORTANT: You will have to clean up after yourself, from shell:
    // `kill $(ps -fe | grep 'chromedriver\|webdriver' | grep -v grep | awk '{print $2}')`

    process.exit(0);
  }


  function writeScreenShot(data, filename) {
    return new Promise(function (resolve, reject) {

      var stream = fs.createWriteStream(filename);
      stream.write(new Buffer(data, 'base64'));

      stream.end(function () {

        var message = ([
          '      \\ | /     ',
          '      - █ -      ',
          '    ▄▄▄███▄▄▄▄▄▄▄',
          '    ██████▀███==█',
          '    █████ O █████',
          '    ██████▄██████'
        ].join('\n') +
        '  Screenshot saved to:\n').cyan;

        console.log(message);
        console.log(filename.white.underline);

        resolve();
      });
    });
  }


  function takeScreenshot(filename, defs) {
    browser.takeScreenshot().then(function (png) {
      writeScreenShot(png, filename).then(function () {
        doExit(defs);
      });
    });
  }


  function doExit (defs) {
    if (defs.keepWebDriverAlive === false) {
      return getTheHellOutOfDodge();
    }

    if (defs.keepWebDriverAlive === true) {
      return uglyExit();
    }
  }


  function makeDir(dir) {
    return new Promise(function (resolve, reject) {
      mkdirp(dir, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(dir);
      });
    });
  }

  var FailWhale = function FailWhale (defs) {

    var dir = defs.directory;

    // Befault behavior: WebDriver quits on enountering the whale
    if (!defs.hasOwnProperty('keepWebDriverAlive')) {
      defs.keepWebDriverAlive = false;
    }

    return {

      jasmineStarted: function(suiteInfo) {
      },

      suiteStarted: function(result) {
      },

      specStarted: function(result) {
      },

      specDone: function(result) {
        for(var i = 0; i < result.failedExpectations.length; i++) {

          console.log( '\n\u001b[31m' +
            '    ▄██████████████▄▐█▄▄▄▄█▌\n' +
            '    ██████▌▄▌▄▐▐▌███▌▀▀██▀▀ \n' +
            '    ████▄█▌▄▌▄▐▐▌▀███▄▄█▌   \n' +
            '    ▄▄▄▄▄██████████████▀    \n' +
            '\u001b[39m');

          var msg = result.failedExpectations[i].message;
          console.log('\u001b[31m' + msg + '\u001b[39m');

          if (defs.hasOwnProperty('showStack') && defs.showStack) {
            console.log(result.failedExpectations[i].stack);
          }

          if (defs.screenshot) {
            var date = new Date();
            var name = date.getFullYear() + '-' +
                       (date.getMonth()+1) + '-' +
                       date.getDate() + '_' +
                       date.getHours() + '-' +
                       date.getMinutes() + '-' +
                       date.getSeconds() + '_'+
                       result.fullName.replace(/\ /g, '-');

            var name = sanitize(name, {
              replacement: '.',
            });

            var filename = dir + '/' + name + '.png';

            try {
              var stat = fs.lstatSync(dir);

              if (stat.isDirectory()){
                takeScreenshot(filename, defs);
              }
            } catch (e) {
              makeDir(dir).then(function () {
                takeScreenshot(filename, defs);
              });
            }
          } else {
            doExit(defs);
          }

        }
      },

      suiteDone: function(result) {
      },

      jasmineDone: function() {
      }
    };

  };


  module.exports = FailWhale;

})();
