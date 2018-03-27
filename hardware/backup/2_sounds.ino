#include "Arduino.h"

#define button 0
#define outLED 13

#define buzzer 3
#define freq 220

void setup() {
  pinMode(button, INPUT);
  pinMode(outLED, OUTPUT);
}

void loop() {
  int pressed = !digitalRead(button);
  digitalWrite(outLED, pressed);
  if (pressed) {
    tone(buzzer, freq, 10);
    delay(10);
  }
}

