class Test < ApplicationRecord
  belongs_to :step
  belongs_to :progress
  has_many :progress_data

  # https://github.com/swanandp/acts_as_list
  acts_as_list scope: :step
end
