/**
 * Copyright 2014 Kamal @MAJiKsystems
 **/


Myo = require('./../lib/Myo/Myo');

module.exports = function(RED) {
    "use strict";
    
    function MyoNode(n) {

        RED.nodes.createNode(this,n);

        this.on('input', function (msg) {
            var devices = Myo.getDevices();
            var myoid = n.myo_selected;

            var device;
            if(myoid && myoid in devices){
                device = Myo.getDevice(myoid);
            }

            if(!device){
                msg.payload = 'Myo ' + myoid + ' not found'
                this.send(msg);
                return;
            }

            var that = this;
            if(device.inplay){
                device.vibrate(0);
                return;
            }

            if(msg.myowinner == myoid){
                device.viberate(0);
                device.viberate(0);
                device.viberate(0);
                device.viberate(0);
            }

            device.vibrate(0.5);
            setTimeout(function(){
                device.vibrate(0);
                setTimeout(function(){
                    device.vibrate(0);
                    setTimeout(function(){
                        device.vibrate(0);
                        device.once('data', function(device){
                            msg.payload = device.pose;
                            msg.device = device.id;
                            that.send(msg, device);
                        });
                    }, 300);
                }, 300);
            }, 1000);
        });

        this.on("close", function() {
        });


    }

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
