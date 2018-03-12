require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'jo', password_digest: 'hn')
  end

  def auth
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test "can create users" do
    post users_url, params: {'user': {"email": 'foo', "password": "bar"}}
    assert_response :success
  end

  test "refuses bad user params" do
    post users_url, params: {'user': {"password": "bar"}}
    assert_response :unprocessable_entity
    post users_url, params: {'user': {"email": "foo"}}
    assert_response :unprocessable_entity
  end

  test "responds correctly" do
    get users_url, headers: auth
    assert_response :success
  end

  test "responds correctly on stub" do
    get "/users?user_id=#{@user.id}", headers: auth
    assert_response :success
  end

  test "responds correctly without auth" do
    get "/users?user_id=#{@user.id}"
    assert_response :unauthorized
  end

  test "responds correctly without auth on different id" do
    get "/users?user_id=#{@user.id+1}"
    assert_response :unauthorized
  end

  test "lists active user from token" do
    get "/users", headers: auth
    assert_instance_of String, response.body["id"]
    assert_instance_of String, response.body["email"]
    assert_nil response.body["error"]
    assert_response :success
  end
end
