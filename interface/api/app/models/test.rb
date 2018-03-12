# == Schema Information
#
# Table name: tests
#
#  id          :integer          not null, primary key
#  step_id     :integer
#  position    :integer
#  title       :text
#  description :text
#  image       :string
#  form        :string
#  output      :text
#  info        :boolean          default(FALSE)
#  jsondata    :string           default("{}")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Test < ApplicationRecord
  belongs_to :step

  has_many :progress_data

  acts_as_list scope: :step
end
