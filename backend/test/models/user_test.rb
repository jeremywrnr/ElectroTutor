require 'test_helper'

class UserTest < ActiveSupport::TestCase
=begin
  test 'valid user' do
    user = User.new(uname: 'John', password: 'john@example.com')
    assert user.valid?
  end

  test 'invalid without uname' do
    user = User.new(password: 'john@example.com')
    refute user.valid?, 'user is valid without a uname'
  end

  test 'invalid without password' do
    user = User.new(uname: 'John')
    refute user.valid?
  end
=end
end
