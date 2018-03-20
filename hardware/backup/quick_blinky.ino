
void setup() {
  pinMode(7, OUTPUT);
}

void loop() {
  digitalWrite(7, HIGH);
  delayMicroseconds(2);
  digitalWrite(7, LOW);
  delayMicroseconds(2);
}

