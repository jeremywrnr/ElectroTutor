#include "Arduino.h"
#include <Adafruit_NeoPixel.h>

#define PIN    7
#define PIXELS 12

int color = 0;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXELS, PIN, NEO_GRB + NEO_KHZ800);
uint32_t white = strip.Color(16, 16, 16); // dim white color

void setup() {
    strip.begin(); // This initializes the NeoPixel library.
    strip.setBrightness(16);
}

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

void rainbow(int start, int wait) {
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

void loop() {
    rainbow(color, 2);
    color = (color+2) % 255;
}
