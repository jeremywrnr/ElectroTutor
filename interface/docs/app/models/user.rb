class User < ApplicationRecord
  validates :email, presence: true
  has_many :tutorial
  has_many :progress
end
