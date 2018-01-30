# hardware

programming the devices uses [the platformio tool][pio].

`Makefile` exists to allow for an easier interface:

    make flash     # compile and upload to both devices
    make device-up #    for project device
    make tester-up #    for testing probe

    make device-read # read project device
    make tester-read # read testing probe
    make close       # close com ports

[pio]:https://github.com/platformio/platformio-core

