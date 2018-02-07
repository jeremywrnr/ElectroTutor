class User < ApplicationRecord
  has_many :tutorials, :dependent => :destroy
  has_many :progresses, :dependent => :destroy
end
