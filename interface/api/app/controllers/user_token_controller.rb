class UserTokenController < Knock::AuthTokenController
  def auth_params
    params.require(:auth).permit :uname, :password
  end
end
