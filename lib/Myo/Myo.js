/**
 * Created by Kamal on 9/20/2014.
 */

var WebSocket = require('ws');
var Device = require('./Devices');
var EventEmitter = require("events").EventEmitter;
var util = require('util');
var ws;

function Myo(){
    EventEmitter.call(this);

    var that = this;
    this.devices = {};
    if(ws){
        return;
    }
    ws = new WebSocket('ws://localhost:7204/myo/1');
    ws.on('message', function(message) {
        var json = JSON.parse(message);
        var data = json[1];
        if (data.type) {
            switch(data.type){
                case "connected":
                    if(!(data.myo in that.devices)){
                        var device = new Device(data, ws);
                        that.devices[data.myo] = device;
                    }
                    that.emit('connect', that.devices[data.myo])
                    that.devices[data.myo].connect();
                    break;
                case "paired":
                    break;
                case "arm_recognized":
                    break;
                case "orientation":
                    if(!(data.myo in that.devices)){
                        console.error('This myo is not recognized');
                        return;
                    }
                    that.devices[data.myo].orientation = data.orientation;
                    that.devices[data.myo].gyroscope = data.gyroscope;
                    break;
                case "pose":
                    if(!(data.myo in that.devices)){
                        console.error('This myo is not recognized');
                        return;
                    }
                    that.devices[data.myo].pose = data.pose;
                    break;
                default:
                    console.log(data.type);
            }
        }
    });
    ws.on('error', function(err){
        console.log(err);
    })
}
util.inherits(Myo, EventEmitter);

Myo.prototype.getDevices = function(){
    var toReturn = [];
    for(var device in this.devices){
        toReturn.push({id: device, name: "Myo " + device })
    }
    return toReturn;
}

Myo.prototype.getDevice = function(id){
    if(!this.devices || !(id in this.devices)){
        return null;
    }

    return this.devices[id];
}

module.exports = new Myo();