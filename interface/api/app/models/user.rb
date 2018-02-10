require 'bcrypt'

class User < ApplicationRecord
  include BCrypt

  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy

  validates :uname, presence: true

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
