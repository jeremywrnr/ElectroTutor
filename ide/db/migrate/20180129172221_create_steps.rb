class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    drop_table :steps
    create_table :steps do |t|
      t.string :name
      t.string :instruction
      t.string :image
      t.string :title
      t.boolean :complete

      t.timestamps
    end
  end
end
