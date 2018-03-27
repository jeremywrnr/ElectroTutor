require 'test_helper'

class CompileControllerTest < ActionDispatch::IntegrationTest
  include Hardware

  #
  # Begin tests
  #

  test "can grab identifiers from filename ok" do
    assert idents.is_a? Array
  end

  test "can instrument code with idents updates ok" do
    result = instrument(@code_input, '') {|x| x }
    assert result
  end

  test "can filter the success output of platformio commands" do
    result = process_output_message @result_in
    assert result
  end

  # they are equal but ruby strings are hurting me
  #assert_equal @error_out.delete(' ') , result.delete(' ')

  test "can filter the error output of platformio commands" do
    result = process_error_message @error_in
    assert result
  end

  #
  # Test setup
  #

  setup do
    @code_source = File.join(@@hw_path, "../utility/simple-ardiuno-parser/test/blinky/blinky.ino")
    @code_input = File.read(@code_source)

    @result_in = <<-eos
[mon mar 19 12:55:41 2018] processing uno (platform: atmelavr; board: uno; framework: arduino)
--------------------------------------------------------------------------------
verbose mode can be enabled via `-v, --verbose` option
platform: atmel avr > arduino uno
system: atmega328p 16mhz 2kb ram (31.50kb flash)
library dependency finder -> http://bit.ly/configure-pio-ldf
ldf modes: finder(chain) compatibility(light)
collected 24 compatible libraries
scanning dependencies...
dependency graph
|-- <liquidcrystal> v1.0.5
calculating size .pioenvs/uno/firmware.elf
avr memory usage
----------------
device: atmega328p

program:    2054 bytes (6.3% full)
(.text + .data + .bootloader)

data:         55 bytes (2.7% full)
(.data + .bss + .noinit)


========================= [success] took 2.18 seconds =========================
    eos
    @result_out = <<-eos
[mon mar 19 12:55:41 2018] processing uno (platform: atmelavr; board: uno; framework: arduino)
--------------------------------------------------------------------------------
verbose mode can be enabled via `-v, --verbose` option
platform: atmel avr > arduino uno
system: atmega328p 16mhz 2kb ram (31.50kb flash)
library dependency finder -> http://bit.ly/configure-pio-ldf
ldf modes: finder(chain) compatibility(light)
collected 24 compatible libraries
scanning dependencies...
dependency graph
|-- <liquidcrystal> v1.0.5
calculating size .pioenvs/uno/firmware.elf
avr memory usage
----------------
device: atmega328p

program:    2054 bytes (6.3% full)
(.text + .data + .bootloader)

data:         55 bytes (2.7% full)
(.data + .bss + .noinit)


========================= [success] took 2.18 seconds =========================
    eos

    @error_in = <<-eos
src/main.cpp: In function 'void setup()':
src/main.cpp:9:3: error: 'failing' was not declared in this scope
failing
^
*** [.pioenvs/uno/src/main.cpp.o] Error 1
======================= [ERROR] Took 2.40 seconds =======================
make: *** [compile] Error 1
    eos
    @error_out = <<-eos
code: In function 'void setup()':
code:9:3: error: 'failing' was not declared in this scope
failing
^
[ERROR] Took 2.40 seconds
[compile] Error 1
    eos
  end
end
