class Test < ApplicationRecord
  include ActiveRecord::Acts::List

  belongs_to :step

  has_many :progress_data

  acts_as_list
end
