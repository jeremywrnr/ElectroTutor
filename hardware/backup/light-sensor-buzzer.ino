#include "Arduino.h"

int sensed;
int sense = A0;
int freq = 220;
int buzzed = 0;
int thresh = 100;
int buzz = 7;

void setup() {
  pinMode(sense, INPUT);
  Serial.begin(115200);
}

void loop() {
  sensed = analogRead(sense);
  Serial.println(sensed);
  if (buzzed && sensed < thresh) {
    buzzed = 0; // reset
  } else if (!buzzed && sensed > thresh) {
    tone(buzz, freq, sensed);
    delay(sensed * 2);
    buzzed = 1;
  }
}

