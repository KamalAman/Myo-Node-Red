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
    this._tempPose = 'rest';
    this._poseTimer = null;
    this._orientation = {};
    this._gyroscope = null;
    this.absVelocity = 0;
    this.gateInterval = 300;
     that.vibrate();
};
util.inherits(Device, EventEmitter);

Object.defineProperty(Device.prototype, "pose", {
    get: function pose() {
        return this._pose;
    },

    set: function pose(pose) {
        var that = this;
        if(pose == this._tempPose)
        {
            return;
        }

        this._tempPose = pose;

        if(pose == 'rest'){
            clearTimeout(that._poseTimer);
            return;
        }

        this.setPoseTimer();


    }
});

Device.prototype.timeoutFunction = function(){
    this._pose = this._tempPose;
    console.log(this.id + ': ' +this._tempPose);
    this.vibrate();
    this.emit('data', this);
}

Device.prototype.setPoseTimer = function(){
    if(this._poseTimer){
        clearTimeout(this._poseTimer);
    }
    this._poseTimer = setTimeout(this.timeoutFunction.bind(this), this.gateInterval);
}


Object.defineProperty(Device.prototype, "gyroscope", {
    get: function gyroscope() {
        return this._gyroscope;
    },

    set: function gyroscope(val) {
        this._gyroscope = val;
        this.absVelocity = 0;

        if(val){
            var temp = 0;
            for(var i = 0; i < val.length; ++i){
                temp += val[i]*val[i];
            }
            if(temp > 0) {
                this.absVelocity = Math.sqrt(temp);
            }
        }

        if(this._tempPose != 'rest' && this.absVelocity > 10){
            this.setPoseTimer();
        }
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
    this.ws.send(JSON.stringify(["command", data]) + "\n");
}


module.exports = Device;
