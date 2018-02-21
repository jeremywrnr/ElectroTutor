# Convenience link layer between server and hw

device:
	cd device && platformio run -e uno -t upload
tester:
	cd tester && platformio run -e uno -t upload

c_device:
	cd device && platformio run -e uno
c_tester:
	cd tester && platformio run -e uno

d_reset:
	@cp -v backup/device.cpp device/src/main.cpp
t_reset:
	@cp -v backup/tester.cpp tester/src/main.cpp
reset: d_reset t_reset

d_read:
	echo todo
t_read:
	echo todo
close:
	echo todo

travis: reset
	cd device && platformio run -e uno
	cd tester && platformio run -e uno


.PHONY: device tester d_reset t_reset d_read t_read close travis
