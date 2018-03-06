/**
 * Simple Analog Probe
 * Read an analog value and write it over serial
 */

#include "Arduino.h"

int enable = 4;
int sense = A0;
int enabled, sensed;
float voltage;

void setup() {
  pinMode(enable, INPUT);
  pinMode(sense, INPUT);
  Serial.begin(115200);
}

void loop() {
  if (digitalRead(enable) == HIGH) {
    sensed = analogRead(sense);
    voltage = sensed * (5.0 / 1023.0);
    Serial.println(voltage);
  }
}
