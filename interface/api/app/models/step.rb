class Step < ApplicationRecord
  belongs_to :tutorial

  has_many :tests, -> { order(position: :asc) }

  acts_as_list
end
