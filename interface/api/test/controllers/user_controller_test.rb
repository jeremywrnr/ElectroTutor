require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  def user
    user = User.create!(uname: 'John', password_digest: 'jo')
  end

  def authenticated_header
    token = Knock::AuthToken.new(payload: { sub: user.id }).token

    {
      'Authorization': "Bearer #{token}"
    }
  end

  test "responds correctly" do
    get users_url, headers: authenticated_header
    assert_response :success
  end

  test "responds correctly on stub" do
    get "/users?user_id=#{user.id}", headers: authenticated_header
    assert_response :success
  end

  test "responds correctly without auth" do
    get "/users?user_id=#{user.id}"
    assert_response :unauthorized
  end

  test "responds correctly without auth on different id" do
    get "/users?user_id=#{user.id+1}"
    assert_response :unauthorized
  end
end
