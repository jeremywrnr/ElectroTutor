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

=begin

steps = []
descriptions.each do |d|
end


tests = {}
steps.each do |step|
  tests[step] = []
  size.times do |i|
    tests[step] << Test.create(
      step_id: step.id,
      description: 'standardizing our tests')
  end
end

progress = {}
steps.each do |step|
  progress[step] = []
  size.times do |i|
    tests[step] << Progress.create(
      user_id: user.id,
      step_id: step.id
    )
  end
end
=end
