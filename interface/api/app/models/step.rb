class Step < ApplicationRecord
  belongs_to :tutorial
  has_many :progresses, :dependent => :destroy
  has_many :tests, :dependent => :destroy
  has_many :users, through: :progresses

  # TODO make better way for accessing sequential steps.
  #https://stackoverflow.com/questions/25665804/rails-best-way-to-get-previous-and-next-active-record-object
  #https://github.com/glebm/order_query

  def next
    #self.class.where()
  end

  def previous
    #self.class.where()
  end

end
