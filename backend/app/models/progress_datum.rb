# == Schema Information
#
# Table name: progress_data
#
#  id          :integer          not null, primary key
#  progress_id :integer
#  test_id     :integer
#  state       :string           default("test")
#  output      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ProgressDatum < ApplicationRecord
  belongs_to :progress
  belongs_to :test
end
