class Tutorial < ApplicationRecord
  belongs_to :user
  has_many :progresses, :dependent => :destroy
  has_many :steps, -> { order(position: :asc) }
end
