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

seed_load(:steps).each_with_index do |x, i|
  step = Tutorial.first.steps.create! x
  step.position = i+1
  step.save!
end

seed_load(:tests).each_with_index do |x, i|
  test = Step.find(i+1).tests.create! x
  test.position = i+1
  test.save!
end

seed_load(:progresses).each_with_index do |x, i|
  prog = Tutorial.find(1).progresses.build x
  prog.user_id = 1
  prog.step_id = 1
  prog.save!
end

seed_load(:progress_data).each_with_index do |x, i|
  data = Progress.find(1).progress_data.build x
  data.test_id = i+1
  data.save!
end
