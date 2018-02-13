# Convenience link layer between server and hw

device:
	cd device && platformio run -e uno -t upload
tester:
	cd tester && platformio run -e uno -t upload

reset: d_reset t_reset
d_reset:
	cp -v backup/device.cpp device/src/main.cpp
t_reset:
	cp -v tester/device.cpp tester/src/main.cpp

d_read:
	echo todo
t_read:
	echo todo
close:
	echo todo

.PHONY: device tester d_reset t_reset d_read t_read close
