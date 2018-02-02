class Progress < ApplicationRecord
  belongs_to :users
  belongs_to :steps
end
