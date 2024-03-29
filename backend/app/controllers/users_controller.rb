class UsersController < ApplicationController
  include Studylogger

  before_action :authenticate_user, except: :create
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /users => return ID of token bearer
  def index
    render json: current_user
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      log_user_act "user-create", user_params # study instrumentation
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      log_user_act "user-update", user_params # study instrumentation
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:id, :email, :password, :current_tutorial)
  end
end
