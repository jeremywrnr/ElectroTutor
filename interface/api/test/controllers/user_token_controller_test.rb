require 'test_helper'

class UserTokenControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'jo', password_digest: 'hn')
  end

  def authenticated_header
    token = Knock::AuthToken.new(payload: { sub: @user.id }).token
    { 'Authorization': "Bearer #{token}" }
  end

  # BEGIN TESTS

  test "generates a token with correct user info" do
    user = User.create!(email: "foo", password: "bar")
    post "/user_token", params: {"auth": {"email": 'foo', "password": "bar"}}
    assert_instance_of String, response.body["jwt"]
    assert_nil response.body["error"]
    assert_response :success
  end

  test "hides a token with wrong user info" do
    user = User.create!(email: "foo", password: "bar")
    post "/user_token", params: {"auth": {"email": 'foo', "password": "boop"}}
    assert_equal '', response.body
    assert_response :not_found
  end
end
