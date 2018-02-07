class CreateProgressData < ActiveRecord::Migration[5.1]
  def change
    create_table :progress_data do |t|
      belongs_to :test, index: true
      belongs_to :progress, index: true
      t.boolean :completed, :default => false
      t.string :output

      t.timestamps
    end
  end
end
