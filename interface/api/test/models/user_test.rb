require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = User.new(name: 'a', password: 'b')
  end

  test "password should be present (nonblank)" do
    @user.password = " " * 6
    assert_not @user.valid?
  end

  test "password should have a minimum length" do
    @user.password = "a" * 5
    assert_not @user.valid?
  end

  should validate_presence_of :name
  should validate_presence_of :password_digest
end
