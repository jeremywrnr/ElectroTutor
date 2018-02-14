require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.create!(email: 'jo', password_digest: 'hn')
    @params = { 'user_id': 2, 'tutorial_id': 2 }
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'should fail getting progress without auth' do
    post progresses_url, params: @params
    assert_response :unprocessable_entity
    post progresses_url, params: @params
    assert_response :unprocessable_entity
  end

  test 'should get progress ok with auth' do
    get progresses_url, headers: auth, params: @params
    assert_response :success
  end

end
