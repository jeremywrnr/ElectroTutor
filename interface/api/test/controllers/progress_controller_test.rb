require 'test_helper'

class ProgressControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = User.new(uname: 'test', password: 'test')
    @user.save!
  end

  #test 'should get with auth' do
    #puts @user.authenticate('test')
    #get '/progresses'
    #assert_response :success, @response.body
  #end

  #test 'should fail index without auth' do
    #get '/progresses'
    #assert_response :error, @response.body
  #end

end
