#include "Arduino.h"

#define button 2
#define outLED 13

void setup() {
  pinMode(button, INPUT_PULLUP);
  pinMode(outLED, OUTPUT);
}

void loop() {
    int press = !digitalRead(button);
    digitalWrite(outLED, press);
}

