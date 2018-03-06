# Convenience link layer between rails and hw

server:
	serial-port-json-server-1.94_macosx/serial-port-json-server -regex usb -v
compile:
	@cd device && platformio run -e uno
device:
	@cd device && platformio run -e uno -t upload
tester:
	@cd tester && platformio run -e uno -t upload
reset:
	@cp -v backup/device.cpp device/src/main.cpp
	@cp -v backup/tester.cpp tester/src/main.cpp
travis: reset
	cd device && platformio run -e uno
	cd tester && platformio run -e uno

.PHONY: device tester compile reset travis
