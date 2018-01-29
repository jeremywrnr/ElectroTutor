class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.string :Tutorial

      t.timestamps
    end
  end
end
