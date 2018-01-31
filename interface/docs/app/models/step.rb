class Step < ApplicationRecord
  belongs_to :tutorial
  has_many :progress
end
