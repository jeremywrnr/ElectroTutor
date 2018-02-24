class ProgressDataController < ApplicationController
  before_action :set_progress_data, only: [:show, :update, :destroy]

  # GET /progress_data
  def index
    @progress_data = ProgressDatum.all

    render json: @progress_data
  end

  # GET /progress_data/1
  def show
    render json: @progress_data
  end

  # POST /progress_data
  def create
    @progress_data = ProgressDatum.new(progress_data_params)

    if @progress_data.save
      render json: @progress_data, status: :created, location: @progress_data
    else
      render json: @progress_data.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /progress_data/1
  def update
    if @progress_data.update(progress_data_params)
      render json: @progress_data
    else
      render json: @progress_data.errors, status: :unprocessable_entity
    end
  end

  # DELETE /progress_data/1
  def destroy
    @progress_data.destroy
  end

  private

  def set_progress
    id = params['id']
    uid = params['user_id']
    tid = params['progress_id']

    if uid == current_user.id.to_s && id.nil? # progress id
      @progress_datum = Progress.where(user_id: uid).where(tutorial_id: tid).first
      if @progress.nil? # create for current user/tut
        step = Step.where(tutorial_id: tid).first # Set step to first step in tutorial
        @progress_datum = current_user.progresses.create!(tutorial_id: tid, step_id: step.id)
      end

    else # direct id param
      @progress_datum = Progress.find(id)

    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_data_params
    params.require(:progress_datum).permit(:progress_datum_id, :progress_id)
  end
end
