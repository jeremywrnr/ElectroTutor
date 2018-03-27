require 'open3'

# http://blog.honeybadger.io/capturing-stdout-stderr-from-shell-commands-via-ruby/

module Hardware
  @@hw_path = Rails.root.join('..', 'hardware/')
  @@out = File.join(@@hw_path, "device/src/main.cpp")
  @@head = '#include "Arduino.h"' + "\n"

  # Makefile has some logic for programming devices.
  def make(task)
    "cd #{@@hw_path} && make #{task}"
  end

  def idents (code='') # returns array
    if !code.empty?
      code = File.open(@@out, 'w') { |f| f.write code }
      eval(%x{#{ make 'ident' }})
    else
      []
    end
  end

  # Open3 provides stdout, stderr, status in a block format

  def upload (code='', task='device')
    if !code.empty? # overwrite user code
      code = File.open(@@out, 'w') { |f| f.write @@head + code }
    end
    yield Open3.popen3(make task)
  end

  def instrument (code, idents) # str, str => str
    File.open(@@out, 'w') { |f| f.write code } # reset
    watch = %x{#{ make "watch vars=#{idents}" }}
  end

  def autoLoader (fn) # str => str
    file = File.join(@@hw_path, "backup", fn)
    puts file
    code = File.read(file)
  end

  # Formatting platformio messages for Arduino console.

  def process_output_message(m)
    m.gsub!(/={3,}/, '')
    m.gsub!(/^\s+/, '')
    m.gsub!(/^(?!\[).*\n/, '')
    m.strip
  end

  def process_error_message(m)
    m.gsub!(/src\/main\.cpp/, 'code')
    m.gsub!(/^.*pioenvs\/uno.*\n/, '')
    m.gsub!(/^.*\*\*\*/, '')
    m.gsub!(/={3,}/, '')
    m.gsub!(/^\s+/, '')
    m.strip
  end
end
