#include <LiquidCrystal.h>

unsigned long time;

LiquidCrystal lcd(11, 10, 5, 4, 3, 2);

void setup()
{
  lcd.begin(16, 2);
  lcd.print("hello");
}

void loop() {
  lcd.setCursor(0, 1);
  time = millis();
  lcd.print(time);
  delay(100);
}