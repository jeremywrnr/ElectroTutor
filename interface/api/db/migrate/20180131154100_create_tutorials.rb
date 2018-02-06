class CreateTutorials < ActiveRecord::Migration[5.1]
  def change
    create_table :tutorials do |t|
      t.belongs_to :user, index: true
      t.string :title
      t.text :description
      t.string :source
      t.string :image

      t.timestamps
    end
  end
end
