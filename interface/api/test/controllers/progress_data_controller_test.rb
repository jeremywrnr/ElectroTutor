require 'test_helper'

class ProgressDataControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.first
    @tutorial = @user.tutorials.create!
    @step = @tutorial.steps.create!
    @test = @step.tests.create!
    @prog = @user.progresses.create!(tutorial_id: @tutorial.id)
    @progdata = @prog.progress_data.create!(test_id: @test.id)
    @params = { 'user_id': @user.id, 'progress_id': @prog.id, 'test_id': @test.id }
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'will fail getting progress_data without auth' do
    get "/progress_data", params: @params
    assert_response :unauthorized
  end

  test 'will create progress_data ok' do
    @test = @step.tests.create!
    @params[:test_id] = @test.id

    get "/progress_data", headers: auth, params: @params
    res = JSON.parse response.body

    ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, res[x] }
    assert_response :success
  end

  test 'will fail to get progress_data from id without auth' do
    get "/progress_data/#{@progdata.id}"
    assert_response :unauthorized
  end

  #test 'will fail to get data that doesnt exist with auth' do
  #get "/progress_data/#{@progdata.id ** 123}", headers: auth
  #assert_response :unauthorized
  #end

  test 'will get progress_data from id ok with auth' do
    get "/progress_data/#{@progdata.id}", headers: auth
    res = JSON.parse response.body
    ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, res[x] }
    assert_response :success
  end

end
