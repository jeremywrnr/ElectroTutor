class ApplicationController < ActionController::API
  include ActionController::Helpers
  include Knock::Authenticable
  include Response

  before_action :authenticate_user
  #before_action :authenticate_user, only: [:show, :update, :destroy]
end
