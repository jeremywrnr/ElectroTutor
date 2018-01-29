class AddCodeToSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :steps, :code, :string
  end
end
