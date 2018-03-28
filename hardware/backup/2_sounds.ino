#include "Arduino.h"

#define buzzer 3
#define freq 220

void setup() {
}

void loop() {
    tone(buzzer, freq, 250);
    delay(500);
}

