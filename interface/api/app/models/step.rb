class Step < ApplicationRecord
  belongs_to :tutorial
  has_many :progresses, :dependent => :destroy
  has_many :tests, :dependent => :destroy

  # https://github.com/swanandp/acts_as_list
  acts_as_list scope: :tutorial
end
