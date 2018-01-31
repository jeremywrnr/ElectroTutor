class Tutorial < ApplicationRecord
  has_many :step
  belongs_to :user
end
