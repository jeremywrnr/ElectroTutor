class Progress < ApplicationRecord
  belongs_to :user
  belongs_to :tutorial
  has_many :progress_data
end
