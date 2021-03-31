/**
 * Script file: index.js
 * Created on: Feb 28, 2018
 * Last modified on: Mar 31, 2021
 * 
 * Comments:
 *  Raspberry Pi relay controller homebridge plugin
 */

var rpio = require('rpio');
let Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-relays", "Relay", RelayAccessory);
}

class RelayAccessory {
    constructor(log, config) {
        /* log instance */
        this.log = log;

        /* read configuration */
        this.name = config.name;
        this.pin = config.pin;
        this.invert = config.invert || false;
        this.initialState = config.initial_state || 0;
        this.timeout = config.timeout_ms || 0;

        /* initialize variables */
        this.timerId = -1;

        /* GPIO initialization */
        this.log.debug("Creating a relay named '%s', initial state: %s", this.name, (this.initialState ? "ON" : "OFF"));
        rpio.open(this.pin, rpio.OUTPUT, this.gpioVal(this.initialState));

        /* run service */
        this.relayService = new Service.Switch(this.name);
    }

    identify(callback) {
        this.log.debug('Accessory identified');
        callback(null);
    }

    gpioValue(val) {
        if (this.invert) {
            val = !val;
        }
        return val ? rpio.HIGH : rpio.LOW;
    }

    getRelayState() {
        /* get relay state (ON, OFF) */
        var val = this.gpioValue(rpio.read(this.pin) > 0);
        return val == rpio.HIGH;
    }

    setRelayState(value) {
        /* clear timeout if already exists */
        if (this.timerId !== -1) {
            clearTimeout(this.timerId);
            this.timerId = -1;
        }

        /* GPIO write operation */
        rpio.write(this.pin, this.gpioValue(value));
        this.log.debug("Pin %d status: %s", this.pin, value);

        /* turn off the relay if timeout is expired */
        if (value && this.timeout > 0) {
            this.timerId = setTimeout(() => {
                rpio.write(this.pin, this.gpioValue(false));
                this.log.debug("Pin %d timed out. Turned off", this.pin);
                this.timerId = -1;
            }, this.timeout);
        }
        callback(null);
    }

    getServices() {
        this.informationService = new Service.AccessoryInformation();
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, 'Smart Technology')
            .setCharacteristic(Characteristic.Model, 'Multi-Relay Controller');

        /* relay control */
        this.relayService
            .getCharacteristic(Characteristic.On)
            .on('get', callback => {
                this.state = this.getRelayState();
                this.log.debug('Relay On:', this.state);
                callback(null, this.state);
            })
            .on('set', (value, callback) => {
                this.setRelayState(value);
                callback(null);
            });

        return [this.informationService, this.relayService];
    }
}