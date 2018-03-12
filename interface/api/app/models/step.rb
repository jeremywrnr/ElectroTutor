# == Schema Information
#
# Table name: steps
#
#  id          :integer          not null, primary key
#  tutorial_id :integer
#  position    :integer
#  description :text
#  title       :string
#  image       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Step < ApplicationRecord
  belongs_to :tutorial

  has_many :tests, -> { order(position: :asc) }

  acts_as_list scope: :tutorial
end
