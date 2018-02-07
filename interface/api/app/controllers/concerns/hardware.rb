module Hardware
  @@hw_path = Rails.root.join('..', '..', 'hardware/')
  @tester_port = ''
  @device_port = ''

  # Makefile has some logic for programming devices.

  def upload (code='', device='device', &block)
    out = File.join(@@hw_path, "#{device}/src/main.cpp")

    File.open(out, 'w') { |f| puts code }

    yield `cd #{@@hw_path} && make #{device}`
  end
end
