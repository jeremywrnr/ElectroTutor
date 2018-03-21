# Convenience link layer between rails and hw

SM=serial-port-json-server-1.94_macosx/serial-port-json-server
AP=../utility/simple-ardiuno-parser/bin/arduino-parser
AC=src/main.cpp

server:
	$(SM) -regex usb -v
compile:
	@cd device && platformio run -e uno
device:
	@cd device && platformio run -e uno -t upload

voltage:
	@cp -v backup/voltage.ino tester/$(AC)
	@cd tester && platformio run -e uno -t upload
frequency:
	@cp -v backup/frequency.ino tester/$(AC)
	@cd tester && platformio run -e uno -t upload

ident:
	@$(AP) device/src/main.cpp --ident
watch: # make watch vars='a,b,c'
	@$(AP) device/src/main.cpp --watch=$(vars)

reset:
	@cp -v backup/device.cpp device/$(AC)
	@cp -v backup/tester.cpp tester/$(AC)
travis: reset
	cd device && platformio run -e uno
	cd tester && platformio run -e uno

.PHONY: server compile device voltage frequency reset travis
