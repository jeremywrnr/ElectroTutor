class CreateTutorials < ActiveRecord::Migration[5.1]
  def change
    drop_table :tutorials
    create_table :tutorials do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
