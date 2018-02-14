class ProgressesController < ApplicationController
  before_action :set_progress, only: [:index, :show, :update, :destroy]

  # QUERY: ?user_id=1 &tutorial_id=1

  # GET /progresses
  def index
    puts params
    authorized = (current_user.id.to_s == params['user_id'])

    if authorized && !@progress.nil?
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
    tid = params['tutorial_id']
    uid = params['user_id']

    @progress = Progress
      .where(tutorial_id: tid)
      .where(user_id: uid)
      .first

    if @progress.nil? && current_user # create one for the current user
      @progress = current_user.build.create!(user_id: uid, tutorial_id: tid)
    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_params
    params.permit(:progress, :id, :user_id, :tutorial_id)
  end
end
