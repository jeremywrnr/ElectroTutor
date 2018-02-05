class Test < ApplicationRecord
  belongs_to :step
  has_many :progresses
end
