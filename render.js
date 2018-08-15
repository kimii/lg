"use strict";
var page = require('webpage').create(),
    system = require('system');

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

if (system.args.length === 1) {
    console.log('Usage: render.js <$url>');
    phantom.exit(1);
} else {
  var url = system.args[1];
  page.open(url, function(status) {
      if (status === "success") {
        console.log( page.content );
        phantom.exit(0);
      } else {
        phantom.exit(1);
      }
  });
}
