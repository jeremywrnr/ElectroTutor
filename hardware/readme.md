# hardware

To program the Arduino Unos, [the platformio tool][pio] is used.

You can install this with conda and the environment file:

    conda env create -f environment.yml

For reading from the serial ports, [spjs][spjs] is used.

The [`Makefile`][mk] provides a simpler interface for common tasks.

    make compile # compile device project
    make device  # compile & upload device project
    make tester  # read testing probe
    make reset   # reset from backup

### related

* serial-port-json-server: https://github.com/chilipeppr/serial-port-json-server/releases
* pio testing: http://docs.platformio.org/en/latest/plus/unit-testing.html
* advanced pio: http://docs.platformio.org/en/latest/projectconf/advanced_scripting.html
* analog read: https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/

[spjs]: https://github.com/platformio/platformio-core
[pio]: https://github.com/platformio/platformio-core
[mk]: ./Makefile
