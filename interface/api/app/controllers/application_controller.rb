# https://www.pluralsight.com/guides/ruby-ruby-on-rails/building-a-crud-interface-with-react-and-ruby-on-rails

class ApplicationController < ActionController::API
  include Response

  before_action :authenticate_request
  attr_reader :current_user

  #protect_from_forgery with: :null_session
  #helper_method :current_user

  private

  def authenticate_request
    @current_user = AuthenticateApiRequest.call(request.headers).result
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end
