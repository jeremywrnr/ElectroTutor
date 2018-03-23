/**
   Simple Analog Probe
   Read an analog value and write it over serial
*/

#include "Arduino.h"

int sensed;
int sense = A1;
float voltage;

void setup() {
  pinMode(sense, INPUT);
  Serial.begin(115200);
}

void loop() {
  sensed = analogRead(sense);
  voltage = sensed * (5.0 / 1023.0);
  Serial.print(voltage);
  Serial.print('_');
}

