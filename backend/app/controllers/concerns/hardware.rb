require 'open3'

# http://blog.honeybadger.io/capturing-stdout-stderr-from-shell-commands-via-ruby/

module Hardware
  @@hw_path = Rails.root.join('..', 'hardware/')
  @tester_port = ''
  @device_port = ''

  # Makefile has some logic for programming devices.

  def upload (code='', task='device', &block)
    out = File.join(@@hw_path, "device/src/main.cpp")

    File.open(out, 'w') { |f| f.write code }

    # stdout, stderr, status
    yield Open3.popen3("cd #{@@hw_path} && make #{task}")
  end

  def process_output_message(m)
    puts 'todo'
    m
  end

  def process_error_message(m)
    m.gsub!(/src\/main\.cpp/, 'code')
    m.gsub!(/^\*\*\*.*\n/, '')
    m.gsub!(/^.*\*\*\*/, '')
    m.gsub!(/={3,}/, '')
    m.gsub!(/^\s+/, '')
    m.strip
  end
end
