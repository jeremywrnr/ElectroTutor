class ProgressesController < ApplicationController
  include Studylogger

  before_action :authenticate_user
  before_action :set_progress, except: [:create]

  # QUERY: ?user_id=1 &tutorial_id=1

  # GET /progresses
  def index
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
      log_user_act "progress-update", progress_params.as_json
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
    id = params['id']
    uid = params['user_id']
    tid = params['tutorial_id']
    pos = params['position']
    if uid == current_user.id.to_s && id.nil? # progress id
      @progress = Progress.where(user_id: uid).where(tutorial_id: tid).first
      if @progress.nil? # create for current user/tut
        @progress = current_user.progresses.create!(tutorial_id: tid, position: 1)
      end
    else # direct id param
      @progress = Progress.find(id)
    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_params
    params.permit(:progress, :code, :id, :user_id, :tutorial_id, :position)
  end
end
