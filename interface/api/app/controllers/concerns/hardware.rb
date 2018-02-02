module Hardware
  @@hw_base = Rails.root.join('..', '..', 'hardware/')
  @tester_port = ''
  @device_port = ''

  # Makefile has some logic for programming devices.

  def upload(code='', device='device', &block)
    out = File.join(@@hw_base, device+'.ino')
    File.open(out, 'w') { |f| puts code }
    yield `cd #{@@hw_base} && make device`
  end
end
