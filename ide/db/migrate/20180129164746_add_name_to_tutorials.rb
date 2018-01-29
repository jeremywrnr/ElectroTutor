class AddNameToTutorials < ActiveRecord::Migration[5.1]
  def change
    add_column :tutorials, :name, :string
  end
end
