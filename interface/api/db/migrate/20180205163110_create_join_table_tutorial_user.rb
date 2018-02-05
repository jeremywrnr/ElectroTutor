class CreateJoinTableTutorialUser < ActiveRecord::Migration[5.1]
  def change
    create_join_table :tutorials, :users do |t|
       t.index [:tutorial_id, :user_id]
      # t.index [:user_id, :tutorial_id]
    end
  end
end
