/**
 * Created by Kamal on 9/20/2014.
 */
var EventEmitter = require("events").EventEmitter;
var util = require('util');


function Device(data, ws){
    var that = this;
    this.ws = ws;
    EventEmitter.call(this)
    this.id = data.myo;
    this._pose = 'rest';
    this._orientation = {};
     that.vibrate();
};
util.inherits(Device, EventEmitter);

Object.defineProperty(Device.prototype, "pose", {
    get: function pose() {
        return this._pose;
    },

    set: function pose(val) {
        console.log(val);
        this._pose = val;
        this.emit('data', this);
    }
});


Object.defineProperty(Device.prototype, "orientation", {
    get: function orientation() {
        return this._orientation;
    },

    set: function orientation(val) {
        this._orientation = val;
        //this.emit('data', this);
    }
});

Device.prototype.connect = function(){
    this.emit('connect', this);
}

Device.prototype.vibrate = function(intensity){
    if(!this.ws || this.id == undefined){
        return;
    }
    intensity? null : intensity = 0;

    var vibrationType;
    if(intensity < 0.3 ){
        vibrationType = "short";
    }
    else if(intensity < 0.6)
    {
        vibrationType = "medium";
    }
    else{
        vibrationType = "long";
    }

    var data = {
        "command": "vibrate",
        "myo": this.id,
        "type": vibrationType
    }
    console.log("Sending vibrate", JSON.stringify(data));
    this.ws.send(JSON.stringify(["command", data]) + "\n");
}


module.exports = Device;
