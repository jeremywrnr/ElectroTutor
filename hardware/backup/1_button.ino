#include "Arduino.h"

#define button 0
#define outLED 13

void setup() {
  pinMode(button, INPUT);
  pinMode(outLED, OUTPUT);
}

void loop() {
    int press = digitalRead(button);
    digitalWrite(outLED, press);
}

