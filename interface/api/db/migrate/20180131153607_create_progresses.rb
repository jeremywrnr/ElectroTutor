class CreateProgresses < ActiveRecord::Migration[5.1]
  def change
    create_table :progresses do |t|
      t.belongs_to :user, index: true
      t.belongs_to :tutorial, index: true
      t.integer :step_id # current step
      t.text :code, :default => ''

      t.timestamps
    end
  end
end
