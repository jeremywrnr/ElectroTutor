class ApplicationController < ActionController::API
  include ActionController::Helpers
  include Knock::Authenticable
  include Response

  before_action :authenticate_user

  private

  def authenticate_request
    @current_user = AuthenticateApiRequest.call(request.headers).result
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end
