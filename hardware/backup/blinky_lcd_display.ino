#include <LiquidCrystal.h>

LiquidCrystal lcd(11, 10, 5, 4, 3, 2);

unsigned long time;
int sense = A1;
int level = 0;

void setup()
{
    pinMode(sense, INPUT);
    pinMode(7, OUTPUT);
    lcd.begin(16, 2);
    lcd.print("hello");
}

void blink() {
    digitalWrite(7, HIGH);
    delay(level);
    digitalWrite(7, LOW);
    delay(level);
}

void loop() {
    level = analogRead(sense);
    lcd.setCursor(0, 1);
    time = millis();
    lcd.print(time);
    blink();
}

