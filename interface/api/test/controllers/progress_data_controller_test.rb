require 'test_helper'

class ProgressDataControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.first
    @tutorial = Tutorial.first

    @step = @tutorial.steps.create!
    @test = @step.tests.create!

    @prog = @user.progresses.create(tutorial_id: @tutorial.id)
    @progdata = @prog.progress_data.create!(test_id: @test.id)

    @params = { 'progress_id': @prog.id }
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'will fail getting progress_data without auth' do
    post progress_data_url, params: @params
    assert_response :unauthorized
  end

  test 'will create progress_data ok with auth for user' do
    return
    tut = Tutorial.new(user_id: @user.id)
    @params[:tutorial_id] = tut.id
    get progress_data_url, headers: auth, params: @params
    assert_instance_of String, response.body["id"]
    #assert_instance_of String, response.body["tutorial_id"]
    assert_instance_of String, response.body["step_id"]
    assert_nil response.body["error"]
    assert_response :success
  end

  test 'will fail to get progress_data from id without auth' do
    return
    get "/progress_data/#{@prog.id}"
    assert_response :unauthorized
  end

  test 'will get progress_data from id ok with auth' do
    get "/progress_data/#{@progdata.id}", headers: auth
    assert_response :success
  end

end
