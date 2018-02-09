class User < ApplicationRecord
  attr_accessor :uname, :current_tutorial

  has_secure_password
  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy

  validates :uname, presence: true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
end
