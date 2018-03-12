# == Schema Information
#
# Table name: progresses
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  tutorial_id :integer
#  step_id     :integer
#  code        :text             default("void setup() {\n\n}\n\nvoid loop() {\n\n}")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Progress < ApplicationRecord
  belongs_to :user
  belongs_to :tutorial
  has_many :progress_data
end
