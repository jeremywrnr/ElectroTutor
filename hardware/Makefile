# Convenience link layer between server and hw

device:
	cd device && platformio run -e uno -t upload
tester:
	cd tester && platformio run -e uno -t upload

reset: d-reset t-reset
d_reset:
	cd device/src && cp -v back.cpp main.cpp
t_reset:
	cd tester/src && cp -v back.cpp main.cpp

d_read:
	echo todo
t_read:
	echo todo
close:
	echo todo

.PHONY: device tester d-reset t-reset d-read t-read close
