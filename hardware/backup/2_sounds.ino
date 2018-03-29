#include "Arduino.h"

#define buzzer 4
#define freq 220

void setup() {
}

void loop() {
    tone(buzzer, freq, 250);
    delay(500);
}

