class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    drop_table :steps
    create_table :steps do |t|
      t.belongs_to :tutorial, index: true
      t.string :name
      t.string :image
      t.string :instruction
      t.boolean :complete

      t.timestamps
    end
  end
end
