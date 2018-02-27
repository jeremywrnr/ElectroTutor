class ProgressDataController < ApplicationController
  before_action :authenticate_user
  before_action :set_progress_data, except: [:create]

  # GET ?progress_id=1  &tids[]=1 &tids[]=2
  def index
    if current_user && !@progress_data.nil?
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

    if @progress_data.save!
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
    tids = params['t_ids']
    tid = params['test_id']
    pid = params['progress_id']

    if !id.nil?
      @progress_data = ProgressDatum.find(id)

    elsif tid && pid
      @progress_data = ProgressDatum.where(test_id: tid).where(progress_id: pid)

    elsif tids && pid
      @progress_data = tids.uniq.map do |tid|
        data = ProgressDatum.where(test_id: tid).where(progress_id: pid).first
        if data.nil?
          prog = Progress.find(pid)
          data = prog.progress_data.create!(test_id: tid.to_i)
        end
        data
      end
    end

    if @progress_data.nil?
      @progress_data = {"errors": "Unable to fetch progress. Need valid user-auth, progress, and test."}
    end
  end

  # Only allow a trusted parameter "white list" through.
  def progress_data_params
    params.permit(:id, :progress_id, :test_id, :user_id, :t_ids)
  end
end
