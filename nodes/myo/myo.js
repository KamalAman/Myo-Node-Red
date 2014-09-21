/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// If you use this as a template, update the copyright with your own name.

// Sample Node-RED node file

var Myo = require('./../../lib/Myo/Myo');

module.exports = function(RED) {
    "use strict";
    // require any external libraries we may need....
    //var foo = require("foo-library");

    // The main node definition - most things happen in here
    function MyoNode(n) {
        // Create a RED node

        RED.nodes.createNode(this,n);


        // respond to inputs....

        var devices = Myo.getDevices();
        var myoid = n.myo_selected;
        var device;
        if(myoid && myoid in devices){
            device = Myo.getDevice(myoid);
        }

        var that = this;

        device.vibrate(0);

        device.vibrate(0.5);

        device.on('pose', function(pose){
            var msg = {topic:n.filename};
            msg.payload = { type: "pose", value: pose };
            that.send(msg, pose);
        });

        device.on('orientation', function(orientation){
/*            var msg = {topic:n.filename};
            msg.payload = { type: "orientation", value: orientation };
            that.send(msg, orientation);*/
        });


        this.on("close", function() {
        });


    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("myo",MyoNode);

    RED.httpAdmin.get("/myo/:id", function(req,res) {


        try {
            var myos = Myo.getDevices();
            res.send(JSON.stringify(myos));
        } catch(err) {
            res.send(500);
            console.log(err.stack);
        }

    });

};