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
    return # TODO, currently unused

    @test = @step.tests.create!
    @params[:test_id] = @test.id

    get "/progress_data", headers: auth, params: @params
    res = JSON.parse response.body
    assert_equal res.nil?, false

    ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, res.first[x] }
    assert_response :success
  end

  test 'will fail to get progress_data from id without auth' do
    get "/progress_data/#{@progdata.id}"
    assert_response :unauthorized
  end

  test 'will get progress_data from id ok with auth' do
    get "/progress_data/#{@progdata.id}", headers: auth
    res = JSON.parse response.body
    ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, res[x] }
    assert_response :success
  end

  test 'will fail to get progress_data from test ids w-o auth' do
    get "/progress_data?user_id#{@user.id}&t_ids[]=#{@test.id}"
    assert_response :unauthorized
  end

  test 'will get progress_data from test ids ok with auth' do
    get "/progress_data?progress_id=#{@prog.id}&t_ids[]=#{@test.id}", headers: auth
    res = JSON.parse response.body
    res.each do |r| ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, r[x] } end
    assert_response :success
  end

  test 'will create progress_data from test ids ok with auth' do
    tids = []; 10.times {|_| tids << (@step.tests.create!).id }
    turi = tids.map { |t| "&t_ids[]=#{t}" }.join

    get "/progress_data?progress_id=#{@prog.id}#{turi}", headers: auth
    res = JSON.parse response.body

    res.each do |r| ["id", "progress_id", "test_id"].map {|x| assert_instance_of Integer, r[x] } end
    assert_equal res.empty?, false
    assert_response :success
  end

end
