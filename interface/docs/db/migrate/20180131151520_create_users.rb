class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, unique: true, null: false
      t.string :password_digest, null: false
      t.integer :tutorial
      t.integer :step

      t.timestamp null: false
    end
  end
end
