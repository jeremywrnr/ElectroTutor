class User < ApplicationRecord
  attr_accessor :name, :current_tutorial

  has_secure_password
  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy

  validates :name, presence: true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
end
