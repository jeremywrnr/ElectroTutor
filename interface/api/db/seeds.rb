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
  .each {|x| User.first.tutorials.create! x }

seed_load(:steps)
  .each {|x| Tutorial.first.steps.create! x }

seed_load(:tests)
  .each {|x| Step.first.tests.create! x }

seed_load(:progresses).each_with_index do |x, i|
  prog = Step.find(i).progresses.build x
  prog.test_id = i
  prog.user_id = 1
  prog.save
end
