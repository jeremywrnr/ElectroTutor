flash: device-up tester-up

device-up:
	source activate python2
	cd device && platformio run -e uno -t upload
tester-up:
	source activate python2
	cd tester && platformio run -e uno -t upload

close:
	echo todo
device-read:
	echo todo
tester-read:
	echo todo

.PHONY: flash close device-up tester-up device-read tester-read
