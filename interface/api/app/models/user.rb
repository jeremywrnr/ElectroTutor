require 'bcrypt'

class User < ApplicationRecord
  include BCrypt

  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy

  def self.from_token_request request
    uname = request.params["auth"] && request.params["auth"]["uname"]
    self.find_by uname: uname
  end

  validates :uname, presence: true, uniqueness: true
  validates :password_digest, presence: true

  def authenticate(pass)
    self.password == pass
  end

  def password
    @password ||= Password.new(password_digest)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_digest = @password
  end
end
