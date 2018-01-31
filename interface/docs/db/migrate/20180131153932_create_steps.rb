class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.text :description
      t.string :title
      t.integer :tutorial_id

      t.timestamps
    end
  end
end
