# Protractor Jasmine 2 Fail Whale

This Jasmine 2 reporter bails (quits the Jasmine/Protractor process) when encountering a failed assert in a Jasmine spec.

Example:

```
    ▄██████████████▄▐█▄▄▄▄█▌
    ██████▌▄▌▄▐▐▌███▌▀▀██▀▀
    ████▄█▌▄▌▄▐▐▌▀███▄▄█▌
    ▄▄▄▄▄██████████████▀

Failed: No element found using locator: By.cssSelector("#erroorr")


      \ | /
      - █ -
    ▄▄▄███▄▄▄▄▄▄▄
    ██████▀███==█
    █████ O █████
    ██████▄██████  Screenshot saved to:

/Users/[user]/repo/test/tmp/2016-2-19_14-17-6_Webpage-should-find-element-ERROORR.png
```

I wrote this after discovering:

1. Protractor could no long use `jasmineNodeOpts.realtimeFailure = true` after upgrading to Jasmine 2.
2. That the available Jasmine2 screenshot reporters could not write screenshot streams to file after the process had died after the Protractor/Jasmine process was terminated (upon bail).


## Install

`npm install protractor-jasmine2-fail-whale --save-dev`


## Usage


### Normal Usage

```javascript

  // Require the Reporter (in your onPrepare)
  var failWhale = require('protractor-jasmine2-fail-whale');

  // Add the Fail Whale Reporter
  jasmine.getEnv().addReporter(new failWhale({

    // Set to true if you would like to see the stack trace
    showStack: false
  }));
```


### Take Screenshots

```javascript

  // Set the screenshot dir relative to the tests
  var dir = __dirname.split('/');
  dir.pop();
  dir.pop();
  dir = dir.join('/') + '/tmp';


  // Fail with error message & screenshot
  var failWhale = require('protractor-jasmine2-fail-whale');
  jasmine.getEnv().addReporter(new failWhale({
    showStack: true,
    screenshot: true,
    directory: dir
  }));
```

### Keep WebDriver & Browser Window Alive

For example: you may want to run browser queries after test fails. This snippet will exit keeping WebDriver & browser-session alive.

```javascript
  var failWhale = require('protractor-jasmine2-fail-whale');

  jasmine.getEnv().addReporter(new failWhale({

    // Keep WebDriver going
    keepWebDriverAlive: true,
  }));
```

Important Note: This may lead to memory issue. Make sure you clean up after yourself. I use the following to kill my WebDriver sessions:

```bash
#!/bin/bash
kill $(ps -fe | grep 'chromedriver\|webdriver' | grep -v grep | awk '{print $2}')
```


