# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

def seed_load(name)
  seed = Rails.root.join('db', 'seeds', "#{name}.yml")
  YAML::load_file seed
end

# Application Data

seed_load(:users)
  .each {|x| User.create! x }

seed_load(:tutorials)
  .each {|x| User.find(1).tutorials.create! x }

seed_load(:steps)
  .each {|x| Tutorial.find(1).steps.create! x }

seed_load(:tests)
  .each {|x| Step.find(1).tests.create! x }

seed_load(:progresses).each do |x|
  prog = Step.find(1).progresses.build x
  prog.user_id = 1
  prog.test_id = 1
  prog.save
end
