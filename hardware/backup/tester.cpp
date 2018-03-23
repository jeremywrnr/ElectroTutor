/**
   Simple Analog Probe
   Read an analog value and write it over serial
*/

#include "Arduino.h"

int sensed;
int sense = A1;

void setup() {
  pinMode(sense, INPUT);
  Serial.begin(115200);
}

void loop() {
  sensed = analogRead(sense);
  Serial.println(sensed);
}

