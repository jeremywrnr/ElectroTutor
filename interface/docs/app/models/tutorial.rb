class Tutorial < ApplicationRecord
  belongs_to :users
  has_many :steps, :dependent => :destroy
end
