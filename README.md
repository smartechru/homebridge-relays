# Homebridge Relays

Controls 4 channel relays with a Raspberry Pi using HomeKit.

# Hardware

The hardware is quite simple to construct.

1. Raspberry Pi 3 Model B
2. 4-relay module pins are connected to 4 GPIO pins (GPIO-17, 27, 22, 05). 

The raspberry pi can then control the state of the relays

# Installation

1. Install homebridge using: `sudo npm install --unsafe-perm -g homebridge`
2. Install this plugin using: `sudo npm install -g --unsafe-perm homebridge-relays`
3. Update your configuration file. See `config.json` in this repository for a sample.