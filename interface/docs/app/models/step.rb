class Step < ApplicationRecord
  belongs_to :tutorial

  has_many :progresses, :dependent => :destroy
  has_many :users, through: :progresses
end
