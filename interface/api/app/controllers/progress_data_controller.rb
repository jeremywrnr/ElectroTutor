class ProgressDataController < ApplicationController
  before_action :authenticate_user
  before_action :set_progress_data, only: [:index, :show, :update, :destroy]

  # QUERY: ?user_id=1 &test_id=1 &progress_id=1

  # GET /progresses
  def index
    authorized = (current_user.id.to_s == progress_data_params['user_id'])

    if authorized && !@progress_data.nil?
      render json: @progress_data
    else
      render json: @progress_data.errors, status: :unprocessable_entity
    end
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

  # PATCH/tUT /progress_data/1
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

  def set_progress_data
    id = params['id']
    tid = params['test_id']
    pid = params['progress_id']

    if id.nil? # progress_data id
      @progress_data = ProgressDatum.where(test_id: tid).where(progress_id: pid).first

      if @progress_data.nil? # create for current test/progress
        progress = Progress.find(pid)

        @progress_data = progress.progress_data.create!(test_id: tid)
      end

    else # direct id param
      @progress_data = ProgressDatum.find(id)

    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_data_params
    params.permit(:id, :progress_id, :test_id, :user_id)
  end
end
