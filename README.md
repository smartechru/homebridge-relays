# Homebridge Relays

Controls 4 channel relays with a Raspberry Pi using HomeKit.

## Hardware

The hardware is quite simple to construct.

1. Raspberry Pi 3 Model B
2. 4-relay module pins are connected to 4 GPIO pins.

The raspberry pi can then control the state of the relays.

## Installation

1. Install homebridge using: `sudo npm install --unsafe-perm -g homebridge`
2. Install this plugin using: `sudo npm install -g --unsafe-perm homebridge-relays`
3. Update your configuration file. See `config-sample.json` in this repository for a sample.

## Sample Configuration

```json
{
  "bridge": {
    "name": "RelayServer",
    "username": "CC:22:3D:E3:CE:FA",
    "port": 51826,
    "pin": "031-45-155"
  },
  "description": "4 Channel Relay",
  "accessories": [
    {
      "accessory": "Relay",
      "name": "Living Room",
      "pin": 11,
      "invert": true,
      "intial_state": 0,
      "timeout_ms": 5000
    },
    {
      "accessory": "Relay",
      "name": "Bedroom",
      "pin": 13,
      "invert": true,
      "initial_state": 0,
      "timeout_ms": 10000
    },
    {
      "accessory": "Relay",
      "name": "Kitchen",
      "pin": 15
    },
    {
      "accessory": "Relay",
      "name": "Garage Door",
      "pin": 29
    }
  ],
  "platforms": []
}
```

## Accessory Configuration Options

| Name | Optional | Description |
| ---- | -------- | ----------- |
| `accessory` | No | Accessory type |
| `name` | No | Default name of an accessory |
| `pin` | No | Raspberry Pi pin number |
| `invert` | Yes | If `true`, output on pin is `LOW` for `ON`, `HIGH` for `OFF` (default: `false`) |
| `initial_state` | Yes | Initial pin state. `1` for `ON`, `0` for `OFF` (default: `0`) |
| `timeout_ms` | Yes | Relay will stay `ON` for a given period of time then `OFF` (default: `0`) |
