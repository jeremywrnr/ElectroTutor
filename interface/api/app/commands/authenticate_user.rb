class AuthenticateUser
  prepend SimpleCommand

  def initialize(uname, password)
    @uname = uname
    @password = password
  end

  def call
    JsonWebToken.encode(user_id: user.id) if user
  end

  private

  attr_accessor :uname, :password

  def user
    user = User.by_uname uname 
    return user if user && user.authenticate(password)

    errors.add :user_authentication, 'invalid credentials'
    nil
  end
end

