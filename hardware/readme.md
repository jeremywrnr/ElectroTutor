# hardware

To program the Arduino Unos, we use [the platformio tool][pio].

You can install this with conda and the environment file:

    conda env create -f environment.yml

- advanced pio: http://docs.platformio.org/en/latest/projectconf/advanced_scripting.html
- pio testing: http://docs.platformio.org/en/latest/plus/unit-testing.html

The [`Makefile`][mk] provides a simpler interface for common tasks:

    make flash       # compile and upload to both devices
    make device-up   #    for project device
    make tester-up   #    for testing probe

    make device-read # read project device
    make tester-read # read testing probe
    make close       # close com ports

[pio]:https://github.com/platformio/platformio-core
[mk]:./Makefile

