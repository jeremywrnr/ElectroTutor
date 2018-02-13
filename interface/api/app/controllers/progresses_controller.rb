class ProgressesController < ApplicationController
  before_action :set_progress, only: [:show, :update, :destroy]

  # QUERY: ?user_id=1 &tutorial_id=1

  # GET /progresses
  def index
    if current_user.id == params['user_id']
      render json: @progress
    else
      render json: @progress.errors, status: :unprocessable_entity
    end
  end

  # GET /progresses/1
  def show
    render json: @progress
  end

  # POST /progresses
  def create
    @progress = Progress.new(progress_params)

    if @progress.save
      render json: @progress, status: :created, location: @progress
    else
      render json: @progress.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /progresses/1
  def update
    if @progress.update(progress_params)
      render json: @progress
    else
      render json: @progress.errors, status: :unprocessable_entity
    end
  end

  # DELETE /progresses/1
  def destroy
    @progress.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.

  def set_progress
    @progress = Progress
      .where(user_id: params['user_id'])
      .where(tutorial_id: params['tutorial_id'])
      .first

    if @progress.nil? # check by id instead
      @progress = Progress.find(params[:id])
    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_params
    params.require(:progress).permit(:tutorial_id, :progress_id)
  end
end
