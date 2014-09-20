/*
 var http = require('http');
 var express = require("express");
 var RED = require("node-red");
 var path = require('path');

 // Create an Express app
 var app = express();

 // Create a server
 var server = http.createServer(app);

 // Create the settings object
 var settings = {
 httpAdminRoot:"/",
 httpNodeRoot: "/api",
 userDir:"./",
 flowFile: path.join(__dirname, "./flows/test.json"),
 nodesDir: path.join(__dirname, "./nodes")
 };

 // Initialise the runtime with a server and settings
 RED.init(server,settings);

 // Serve the editor UI from /red
 app.use(settings.httpAdminRoot,RED.httpAdmin);

 // Serve the http nodes UI from /api
 app.use(settings.httpNodeRoot,RED.httpNode);


 server.listen(1880);


 RED.start();



 */

var Myo = require('./lib/Myo/Myo');

var x = new Myo();





//setInterval(requestVibrate, 3000);
//setInterval(requestSignal, 3000);