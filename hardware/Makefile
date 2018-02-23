# Convenience link layer between server and hw

device:
	@cd device && platformio run -e uno -t upload
tester:
	@cd tester && platformio run -e uno -t upload

c_device:
	@cd device && platformio run -e uno
c_tester:
	@cd tester && platformio run -e uno

d_reset:
	@cp -v backup/device.cpp device/src/main.cpp
t_reset:
	@cp -v backup/tester.cpp tester/src/main.cpp
reset: d_reset t_reset

d_read:
	@cd device && platformio device monitor
t_read:
	@cd tester && platformio device monitor
d_close:
	echo todo
t_close:
	echo todo
close: d_close t_close

travis: reset
	cd device && platformio run -e uno
	cd tester && platformio run -e uno


.PHONY: device tester d_reset t_reset d_read t_read close travis
