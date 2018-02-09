require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest

  test 'should return one progress when queried' do
    get '/progresses?user_id=1&tutorial_id=1'
    assert_response :success, @response.body
  end

end
