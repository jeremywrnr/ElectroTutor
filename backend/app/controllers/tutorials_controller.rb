class TutorialsController < ApplicationController
  before_action :set_tutorial, only: [:show, :update, :destroy]

  # GET /tutorials
  def index
    @tutorials = Tutorial.all

    render json: @tutorials
  end

  # GET /tutorials/1
  def show
    render json: @tutorial
  end

  # POST /tutorials
  def create
    @tutorial = Tutorial.new(tutorial_params)

    if @tutorial.save
      render json: @tutorial, status: :created, location: @tutorial
    else
      render json: @tutorial.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tutorials/1
  def update
    if @tutorial.update(tutorial_params)
      render json: @tutorial
    else
      render json: @tutorial.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tutorials/1
  def destroy
    @tutorial.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_tutorial
    @tutorial = Tutorial.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def tutorial_params
    params.require(:tutorial).permit(:step)
  end
end
