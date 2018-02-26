require 'test_helper'

class ProgressDataControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.first
    @tutorial = Tutorial.first
    @params = { 'user_id': @user.id, 'tutorial_id': @tutorial.id  }
    @prog = @user.progress_data.create(tutorial_id: @tutorial.id)
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'will fail getting progress_datum without auth' do
    post progress_data_url, params: @params
    assert_response :unauthorized
    post progress_data_url, params: @params
    assert_response :unauthorized
  end

  test 'will create progress_datum ok with auth for user' do
    tut = Tutorial.new(user_id: @user.id)
    @params[:tutorial_id] = tut.id
    get progress_data_url, headers: auth, params: @params
    assert_instance_of String, response.body["id"]
    assert_instance_of String, response.body["tutorial_id"]
    assert_instance_of String, response.body["step_id"]
    assert_nil response.body["error"]
    assert_response :success
  end

  test 'will fail to progress_datum from id without auth' do
    get "/progress_data/#{@prog.id}"
    assert_response :unauthorized
  end

  test 'will get progress_datum from id ok with auth' do
    get "/progress_data/#{@prog.id}", headers: auth
    assert_response :success
  end

end
