#include "Arduino.h"

int sense = A0;

long freq = 0;
long sum;
long ms;

int len = 20;
int window[20];

int last;
int now;

void setup() {
  pinMode(sense, INPUT);
  Serial.begin(115200);
  last = digitalRead(sense);
  ms = millis();
}

void loop() {
  now = digitalRead(sense);
  if (last != now) {
    last = now;
    freq = freq + 1;
  }

  if (ms + 100 < millis()) {  // dumping
    sum = freq;

    for (int i = 0; i < len - 1; i++) {
      window[i] = window[i + 1];
      sum += window[i];
    }

    window[len - 1] = freq;

    Serial.print(1.0 * sum / 2, 2); // 2second sample window.
    Serial.print('_'); // delimiter
    ms = millis();
    freq = 0;
  }
}

