#include "Arduino.h"
#include <Adafruit_NeoPixel.h>

#define PIN            7
#define NUMPIXELS      12
#define RESETPIN       13

int color = 0;
int sense = A1;
int freq = 220;
int buzzing = 0;
int thresh_lo = 100;
int thresh_hi = 900;
int buzzer = 5;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

uint32_t white = strip.Color(16, 16, 16); // dim white color

int delayval = 500; // delay for half a second

void blankState() {
  for (int i = 0; i < NUMPIXELS; i++)
    strip.setPixelColor(i, white);
  strip.show();
}

void setup() {
  pinMode(sense, INPUT);
  pinMode(RESETPIN, INPUT_PULLUP);
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


//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(int start, int wait) {
  int j = start;

    for (int q = 0; q < 3; q++) {
      for (int i = 0; i < strip.numPixels(); i = i + 3) {
        strip.setPixelColor(i + q, Wheel( (i + j) % 255)); //turn every third pixel on
      }
      
      strip.show();
      delay(wait);

      for (int i = 0; i < strip.numPixels(); i = i + 5) {
        strip.setPixelColor(i + q, 0);      //turn every third pixel off
      }
    }
  
}

void buzz() {
    tone(buzzer, freq, 100);
    theaterChaseRainbow(color, 0);
    color = (color+2) % 255;
}

void loop() {
  int sensed = analogRead(sense);
  int reset = digitalRead(RESETPIN);
  Serial.println(sensed);
  if (buzzing) {
      if (reset == LOW) {
          blankState();
          buzzing = 0; // reset
      } else {
          buzz();
      }
  } else if (!buzzing && sensed > thresh_hi) {
    buzzing = 1; // begin
  }
}
