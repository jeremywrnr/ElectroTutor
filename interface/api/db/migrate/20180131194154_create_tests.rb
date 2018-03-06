class CreateTests < ActiveRecord::Migration[5.1]
  def change
    create_table :tests do |t|
      t.belongs_to :step, index: true
      t.integer :position
      t.text :title
      t.text :description
      t.string :image

      t.text :output
      t.string :type

      t.boolean :info, default: false
      t.string :jsondata, default: '{}'

      t.timestamps
    end
  end
end
