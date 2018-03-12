require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.first
    @tutorial = Tutorial.first
    @params = { 'user_id': @user.id, 'tutorial_id': @tutorial.id  }
    @prog = @user.progresses.create(tutorial_id: @tutorial.id)
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test 'will fail getting progress without auth' do
    post "/progresses", params: @params
    assert_response :unauthorized
  end

  test 'will create progress ok with auth for user' do
    tut = Tutorial.create!(user_id: @user.id)
    @params[:tutorial_id] = tut.id
    tut.steps.create!

    get "/progresses", headers: auth, params: @params
    res = JSON.parse response.body

    ["id", "tutorial_id", "step_id"].map {|x| assert_instance_of Integer, res[x] }
    assert_nil res["error"]
    assert_response :success
  end

  test 'will fail to progress from id without auth' do
    get "/progresses/#{@prog.id}"
    assert_response :unauthorized
  end

  test 'will get progress from id ok with auth' do
    get "/progresses/#{@prog.id}", headers: auth
    assert_response :success
  end

end
