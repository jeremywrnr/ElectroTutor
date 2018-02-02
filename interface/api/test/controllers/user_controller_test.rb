require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  test "should get step:integer" do
    get user_step:integer_url
    assert_response :success
  end

  test "should get tutorial:integer" do
    get user_tutorial:integer_url
    assert_response :success
  end

end
