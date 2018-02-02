class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.belongs_to :tutorial, index: true
      t.text :description
      t.string :title

      t.timestamps
    end
  end
end
