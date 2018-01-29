class AddInstructionToStep < ActiveRecord::Migration[5.1]
  def change
    add_column :steps, :title, :string
    add_column :steps, :instruction, :text
    add_column :steps, :complete, :boolean
  end
end
