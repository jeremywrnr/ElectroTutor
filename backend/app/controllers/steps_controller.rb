class StepsController < ApplicationController
  before_action :authenticate_user
  before_action :set_step, only: [:show, :update, :destroy]

  # GET /steps
  def index
    @steps = Step.all

    render json: @steps
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
    pos = params[:tutorial_id]
    tut = params[:position]

    if id.nil?
      @step = Step.where(position: pos).where(tutorial_id: tut).first
    else
      @step = Step.find(params[:id])
    end
  end

  # Only allow a trusted parameter "white list" through.
  def step_params
    params.permit(:tutorial_id, :id, :step_id, :position)
  end
end
