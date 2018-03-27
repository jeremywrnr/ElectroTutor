#include "Arduino.h"

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN            5
#define NUMPIXELS      12

int sensed;
int sense = A1;
int freq = 220;
int buzzed = 0;
int thresh_lo = 100;
int thresh_hi = 900;

int buzz = 7;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

uint32_t white = strip.Color(16, 16, 16); // dim white color

int delayval = 500; // delay for half a second

void setup() {
  pinMode(sense, INPUT);
  Serial.begin(115200);
  strip.begin(); // This initializes the NeoPixel library.
  strip.setBrightness(16);
  blankState();
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if (WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

void blankState() {
  for (int i = 0; i < NUMPIXELS; i++)
    strip.setPixelColor(i, white);
  strip.show();
}

//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(int wait) {
  for (int j = 0; j < 256; j++) {   // cycle all 256 colors in the wheel
    for (int q = 0; q < 3; q++) {
      for (int i = 0; i < strip.numPixels(); i = i + 3) {
        strip.setPixelColor(i + q, Wheel( (i + j) % 255)); //turn every third pixel on
      }
      strip.show();

      delay(wait);

      for (int i = 0; i < strip.numPixels(); i = i + 3) {
        strip.setPixelColor(i + q, 0);      //turn every third pixel off
      }
    }
  }
}

void loop() {
  sensed = analogRead(sense);
  Serial.println(sensed);
  if (buzzed && sensed < thresh_lo) {
    buzzed = 0; // reset
  } else if (!buzzed && sensed > thresh_hi) {
    tone(buzz, freq, 200);
    theaterChaseRainbow(10);
    blankState();
    buzzed = 1;
  }
}

