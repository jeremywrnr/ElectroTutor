class Tutorial < ApplicationRecord
  belongs_to :user
  has_many :progresses, :dependent => :destroy
  has_many :steps, :dependent => :destroy
end
