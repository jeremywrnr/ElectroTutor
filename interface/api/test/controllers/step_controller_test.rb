require 'test_helper'

class StepControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'jo', password_digest: 'hn')
    @tuto = @user.tutorials.create!(title: 'ho', description: 'hi')
    @step = @tuto.steps.create!(description: 'hi')
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  def params
    { 'step': { 'id': @step.id }, 'tutorial_id': @tuto.id }
  end

  # BEGIN TESTS

  test "can create steps" do
    post steps_url, params: params, headers: auth
    assert_response :success
  end

  test "refuses bad step params" do
    post steps_url, params: {'user': {"password": "bar"}}, headers: auth
    assert_response :unprocessable_entity
  end

  test "responds correctly" do
    get steps_url, headers: auth
    assert_response :success
  end

  test "responds correctly on stub" do
    get "/steps?step_id=#{@step.id}", headers: auth
    assert_response :success
  end

  test "responds correctly without auth" do
    get "/steps?step_id=#{@step.id}"
    assert_response :unauthorized
  end

  test "responds correctly without auth on different id" do
    get "/steps?step_id=#{@step.id+1}"
    assert_response :unauthorized
  end

  test "lists active step from token" do
    get "/steps", headers: auth
    assert_instance_of String, response.body["id"]
    assert_nil response.body["error"]
    assert_response :success
  end
end
