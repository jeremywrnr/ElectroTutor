class ProgressDataController < ApplicationController
  before_action :set_test, only: [:show, :update, :destroy]

  # GET /progress_data
  def index
    @progress_data = Test.all

    render json: @progress_data
  end

  # GET /progress_data/1
  def show
    render json: @test
  end

  # POST /progress_data
  def create
    @test = Test.new(test_params)

    if @test.save
      render json: @test, status: :created, location: @test
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /progress_data/1
  def update
    if @test.update(test_params)
      render json: @test
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  # DELETE /progress_data/1
  def destroy
    @test.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_test
    @test = Test.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def test_params
    params.require(:test).permit(:test_id, :progress_id)
  end
end
