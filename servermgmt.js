
var express     = require('express');
var app         = express();
var path        = require('path');
var bodyParser  = require('body-parser');
var sh          = require('shelljs');
var auth = require('./auth');

var port = process.env.PORT || 8080;
var doToken = "secretToken";
var doDropletID = "secretID";

app.use(auth);

app.get('/status', function(req, res) {
  console.log("GET /status");
  var sout = sh.exec('doctl compute droplet list -t '+doToken, {silent:true}).stdout;
  console.log(sout);
  var str = sout.toString(), lines = str.split(/(\r?\n)/g);
  var rsout = "<!DOCTYPE html><html><head></head><body style='text-align:center;'><h3 style='font-family: Monospace, Times, serif;'>CBODIES SERVER STATUS</h3>";
  for (var i=0; i<(lines.length - lines.length/2); i++) {
    rsout += "<p>"+lines[i]+"</p>";
  }
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/&quot;;' value='BACK TO MGMT' /></p>";
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/status&quot;;' value='STATUS AGAIN' /></p></body></html>";
  res.send(rsout);
});

app.get('/start', function(req, res) {
  console.log("GET /start");
  var sout = sh.exec('doctl compute droplet-action power-on '+doDropletID+' -t '+doToken, {silent:true}).stdout;
  console.log(sout);
  var str = sout.toString(), lines = str.split(/(\r?\n)/g);
  var rsout = "<!DOCTYPE html><html><head></head><body style='text-align:center;'><h3 style='font-family: Monospace, Times, serif;'>CBODIES SERVER START</h3>";
  for (var i=0; i<lines.length; i++) {
    rsout += "<p>"+lines[i]+"</p>";
  }
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/&quot;;' value='BACK TO MGMT' /></p>";
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/start&quot;;' value='START AGAIN' /></p></body></html>";
  res.send(rsout);
});

app.get('/stop', function(req, res) {
  console.log("GET /stop");
  var sout = sh.exec('doctl compute droplet-action shutdown '+doDropletID+' -t '+doToken, {silent:true}).stdout;
  console.log(sout);
  var str = sout.toString(), lines = str.split(/(\r?\n)/g);
  var rsout = "<!DOCTYPE html><html><head></head><body style='text-align:center;'><h3 style='font-family: Monospace, Times, serif;'>CBODIES SERVER STOP</h3>";
  for (var i=0; i<lines.length; i++) {
    rsout += "<p>"+lines[i]+"</p>";
  }
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/&quot;;' value='BACK TO MGMT' /></p>";
  rsout += "<p><input style='width:300px' type='button' onclick='location.href=&quot;/stop&quot;;' value='STOP AGAIN' /></p></body></html>";
  res.send(rsout);
});

// WEB
app.use(express.static('public'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
