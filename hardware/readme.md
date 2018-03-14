# hardware

To program the Arduino Unos, [the platformio tool][pio] is used.

You can install this with conda and the environment file:

    conda env create -f environment.yml

For reading from the serial ports, [spjs][spjs] is used.

The [`Makefile`][mk] provides a simpler interface for common tasks.

    make         # start SPJS server
    make compile # compile device project
    make device  # compile & upload device project
    make tester  # read testing probe
    make reset   # reset from backup

### related

* serial-port-json-server: https://github.com/chilipeppr/serial-port-json-server/releases
* pio testing: http://docs.platformio.org/en/latest/plus/unit-testing.html
* advanced pio: http://docs.platformio.org/en/latest/projectconf/advanced_scripting.html
* analog read: https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/
  * shorter example: https://www.arduino.cc/en/Tutorial/ReadAnalogVoltage
* simulation: https://www.nongnu.org/simulavr/
  * gnu simulAVR: https://www.nongnu.org/simulavr/
  * github/newer: https://github.com/buserror/simavr

[spjs]: https://github.com/chilipeppr/serial-port-json-server
[pio]: https://github.com/platformio/platformio-core
[mk]: ./Makefile
