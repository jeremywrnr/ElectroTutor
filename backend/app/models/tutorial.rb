# == Schema Information
#
# Table name: tutorials
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  title       :string
#  description :text
#  source      :string
#  image       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Tutorial < ApplicationRecord
  belongs_to :user
  has_many :progresses, :dependent => :destroy
  has_many :steps, -> { order(position: :asc) }
end
