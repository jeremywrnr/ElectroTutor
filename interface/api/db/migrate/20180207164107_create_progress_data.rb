class CreateProgressData < ActiveRecord::Migration[5.1]
  def change
    create_table :progress_data do |t|
      t.belongs_to :progress, index: true
      t.belongs_to :test,     index: true

      t.string :state, :default => 'test'
      t.string :output

      t.timestamps
    end
  end
end
