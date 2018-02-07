class Test < ApplicationRecord
  belongs_to :step

  has_many :progress_data

  acts_as_list
end
