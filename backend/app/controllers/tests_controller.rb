class TestsController < ApplicationController
  before_action :authenticate_user
  before_action :set_step, only: [:step]
  before_action :set_test, only: [:show, :update, :destroy]

  # GET /tests
  def index
    @tests = Test.all
    render json: @tests
  end

  # GET /tests/1
  def show
    render json: @test
  end

  # GET /test?tutorial_id=1&position=2
  # terrible, terrible routing
  def step
    if @step.nil?
      render json: {}, status: :not_found
    else
      @tests = Test.where(step_id: @step.id)
      render json: @tests
    end
  end

  # POST /tests
  def create
    @test = Test.new(test_params)

    if @test.save
      render json: @test, status: :created, location: @test
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tests/1
  def update
    if @test.update(test_params)
      render json: @test
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tests/1
  def destroy
    @test.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_test
    @test = Test.find(params[:id])
  end

  def set_step
    pos = params[:position]
    tut = params[:tutorial_id]
    @step = Step.where(tutorial_id: tut).where(position: pos).first
  end

  # Only allow a trusted parameter "white list" through.
  def test_params
    params.require(:test).permit(:tutorial_id, :position)
  end
end
