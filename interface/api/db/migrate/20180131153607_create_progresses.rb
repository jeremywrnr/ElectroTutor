class CreateProgresses < ActiveRecord::Migration[5.1]
  def change
    create_table :progresses do |t|
      t.belongs_to :user, index: true
      t.belongs_to :step, index: true
      t.belongs_to :test, optional: true
      t.boolean :completed, :default => false
      t.string :jsondata
      t.text :code

      t.timestamps
    end
  end
end
