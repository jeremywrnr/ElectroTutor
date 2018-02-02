class CreateTests < ActiveRecord::Migration[5.1]
  def change
    create_table :tests do |t|
      t.belongs_to :step, index: true
      t.text :description
      t.string :exec
      t.string :image
      t.text :output
      t.boolean :complete
      t.string :jsondata

      t.timestamps
    end
  end
end
