class CreateTutorials < ActiveRecord::Migration[5.1]
  def change
    create_table :tutorials do |t|
      t.belongs_to :user, index: true
      t.text :description
      t.string :title
      t.string :image

      t.timestamps
    end
  end
end
