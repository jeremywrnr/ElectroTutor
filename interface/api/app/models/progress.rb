class Progress < ApplicationRecord
  belongs_to :user
  belongs_to :step
  belongs_to :test
end
