#include "Arduino.h"

long freq = 0;
long sum;
long ms;

int len = 20;
int window[20];

int last;
int now;

void setup() {
  pinMode(A1, INPUT);
  Serial.begin(9600);
  last = digitalRead(A1);
  ms = millis();
}

void loop() {
  now = digitalRead(A1);
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

    Serial.print(sum/2); // 2second sample window.
    Serial.print('_'); // delimiter
    ms = millis();
    freq = 0;
  }
}

