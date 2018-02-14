require 'test_helper'

class StepControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = @tuto.user
    @tuto = Tutorial.first
    @step = @tuto.steps.first
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test "can create steps" do
    post steps_url, params: {}
    assert_response :success
  end

  test "refuses bad step params" do
    post steps_url, params: {}
    assert_response :unprocessable_entity
    post steps_url, params: {}
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
