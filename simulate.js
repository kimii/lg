var casper = require('casper').create(),
    system = require('system'),
    utils = require('utils'),
    fs = require('fs');

var ip = '202.118.224.100';

function d2l(d){
  return Object.keys(d).map( function(k){
    return [ k, d[k] ] 
  });
}

function fill(data, tuples){
  tuples.forEach( function(t){
    if (Array.isArray(t[1].data)){
      data[ t[0] ] = t[1].data[0].value;
    }else{
      if( t[1].type == 'checkbox' || t[1].type == 'radio' ){
        data[ t[0] ] = t[1].data.value;
      }
    }
  });
}

if (system.args[system.args.length-1] == "simulate.js") {
  console.log('Usage: simulate.js <$site>');
  casper.exit();
} else {
  // construct form data form db.
  var db = JSON.parse(fs.read( fs.workingDirectory + '/db.json' ));
  var site = system.args[system.args.length-1];

  site = db[site];
  if (!site) casper.exit();

  var url = site.index;

  var data = {};
  data[site.target] = ip;
  [
    site.cmd,
    site.nodes,
    site.options,
    site.input
  ].forEach( function(d){
    if (d) fill( data, d2l(d) );
  });

  console.log(JSON.stringify(data));
  /*
  casper.on('resource.received', function(responseData){
    console.log( JSON.stringify(responseData) );
  });
  */
  // start simulation
  casper.start(url, function() {
    this.waitForSelector('form');
  });

  casper.then(function(){
    this.fill('form', data, false);
    casper.click('button[type=submit]');
  });

  casper.waitForResource(function(resource) {
    return resource.url.indexOf(ip) != -1 && resource.stage == 'end';
  }, null, null, 60*1000);

  casper.then(function(){
    var h = this.evaluate(function(){
      var html = document.documentElement.innerHTML;
      return html
    });
    this.echo( h );
  });

  casper.run();
}
