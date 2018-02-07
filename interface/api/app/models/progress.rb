class Progress < ApplicationRecord
  belongs_to :user
  belongs_to :tutorial
  has_many :tests
end
