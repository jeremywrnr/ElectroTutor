# Convenience link layer between rails and hw

server:
	serial-port-json-server-1.94_macosx/serial-port-json-server -regex usb -v
compile:
	@cd device && platformio run -e uno
device:
	@cd device && platformio run -e uno -t upload

voltage:
	@cp -v backup/voltage.ino tester/src/main.cpp
	@cd tester && platformio run -e uno -t upload
frequency:
	@cp -v backup/frequency.ino tester/src/main.cpp
	@cd tester && platformio run -e uno -t upload

ident:
	@simple-ardiuno-parser/bin/arduino-parser device/src/main.cpp --ident
watch: # make watch vars='a,b,c'
	simple-ardiuno-parser/bin/arduino-parser device/src/main.cpp --watch=$(vars)

reset:
	@cp -v backup/device.cpp device/src/main.cpp
	@cp -v backup/tester.cpp tester/src/main.cpp
travis: reset
	cd device && platformio run -e uno
	cd tester && platformio run -e uno

.PHONY: server compile device voltage frequency reset travis
