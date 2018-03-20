class CreateProgresses < ActiveRecord::Migration[5.1]
  def change
    create_table :progresses do |t|
      t.belongs_to :user, index: true
      t.belongs_to :tutorial, index: true
      t.integer :position # current step
      t.text :code, :default => "void setup() {\n\n}\n\nvoid loop() {\n\n}"

      t.timestamps
    end
  end
end
