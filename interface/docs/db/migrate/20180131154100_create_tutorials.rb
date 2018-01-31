class CreateTutorials < ActiveRecord::Migration[5.1]
  def change
    create_table :tutorials do |t|
      t.integer :user_id
      t.text :description
      t.string :title
      t.string :image

      t.timestamps
    end
  end
end
