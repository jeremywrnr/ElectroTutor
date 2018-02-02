class User < ApplicationRecord
  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy
  has_many :steps, through: :progresses

  validates :email, presence: true
end
