int level;

void setup() {
    pinMode(A1, INPUT);
    pinMode(7, OUTPUT);
}

void loop() {
    level = analogRead(A1);
    digitalWrite(7, HIGH);
    delayMicroseconds(level);
    digitalWrite(7, LOW);
    delayMicroseconds(level);
}

