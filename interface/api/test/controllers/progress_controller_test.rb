require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.first
    @tutorial = Tutorial.first
    @params = { 'user_id': @user.id, 'tutorial_id': @tutorial.id  }
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'will fail getting progress without auth' do
    post progresses_url, params: @params
    assert_response :unauthorized
    post progresses_url, params: @params
    assert_response :unauthorized
  end

  test 'will create progress ok with auth for user' do
    tut = Tutorial.new(user_id: @user.id)
    @params[:tutorial_id] = tut.id
    get progresses_url, headers: auth, params: @params
    assert_response :success
  end

  test 'will get progress ok with auth' do
    get progresses_url, headers: auth, params: @params
    assert_response :success
  end

end
