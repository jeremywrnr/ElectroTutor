class StepsController < ApplicationController
  before_action :authenticate_user
  before_action :set_step, only: [:index, :show, :update, :destroy]

  # GET /steps
  def index
    if @step.nil?
      render json: {}, status: :not_found
    else
    render json: @step
    end
  end

  # GET /steps/1
  def show
    render json: @step
  end

  # POST /steps
  def create
    @step = Step.new(step_params)

    if @step.save
      render json: @step, status: :created, location: @step
    else
      render json: @step.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /steps/1
  def update
    if @step.update(step_params)
      render json: @step
    else
      render json: @step.errors, status: :unprocessable_entity
    end
  end

  # DELETE /steps/1
  def destroy
    @step.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_step
    id = params[:id]
    tut = params[:tutorial_id]
    pos = params[:position]

    if id.nil?
      @step = Step.where(tutorial_id: tut).where(position: pos).first
    else
      @step = Step.find(params[:id])
    end
  end

  # Only allow a trusted parameter "white list" through.
  def step_params
    params.permit(:tutorial_id, :id, :step_id, :position)
  end
end
