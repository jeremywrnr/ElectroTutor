# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

require 'pp'

def seed_load(name)
  seed = Rails.root.join('db', 'seeds', "#{name}.yml")
  YAML::load_file seed
end

# Application Data

seed_load(:users).each {|x| User.create! x }

seed_load(:tutorials).each do |t|
  tut = User.first.tutorials.create! t['tutorial']

  t['steps'].each_with_index do |s, i|
    step = tut.steps.create! s
    step.position = i+1
    step.save!

    !s['tests'].nil? && s['tests'].each_with_index do |x, i|
      test = step.tests.create! x
      test.position = i+1
      test.save!
    end
  end
end

=begin
# todo - make progress data load for each user.
seed_load(:progress_data).each_with_index do |x, i|
  data = Progress.first.progress_data.build x
  data.test_id = i+1
  data.save!
end
=end
