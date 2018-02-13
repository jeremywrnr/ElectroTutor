/**
 * Simple Analog Probe
 * Read an analog value and write it over serial
 */

#include "Arduino.h"

int probePin = A5;

void setup() {
    Serial.begin(115200);
}

void loop() {
    Serial.println(analogRead(probePin));
}
