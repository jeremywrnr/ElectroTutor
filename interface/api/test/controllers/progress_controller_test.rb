require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest
  test 'should return one progress when queried' do
    get '/progresses?user_id=1&step_id=2'
    assert_response :success, @response.body
  end

=begin
  test "should get step:integer" do
    get user_step:integer_url
    assert_response :success
  end

  test "should get tutorial:integer" do
    get user_tutorial:integer_url
    assert_response :success
  end
=end

end
