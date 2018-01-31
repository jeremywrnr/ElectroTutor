class CreateProgresses < ActiveRecord::Migration[5.1]
  def change
    create_table :progresses do |t|
      t.integer :user_id
      t.integer :step_id
      t.boolean :completed

      t.timestamps
    end
  end
end
