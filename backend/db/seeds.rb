# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

require 'pp'

def seed_load(name)
  seed = Rails.root.join('db', 'seeds', "#{name}.yml")
  YAML::load_file seed
end

# Application Data

seed_load(:users).each {|x| User.create! x }

seed_load(:tutorials).each_with_index do |t, i|
  tut = User.first.tutorials.create! t['tutorial']

  t['steps'].each_with_index do |s, i|
    tests = s['tests']
    s.delete 'tests'
    step = tut.steps.create! s
    step.position = i+1
    step.save!

    if !tests.nil?
      tests.each_with_index do |x, j|
        test = step.tests.create! x
        test.position = j+1
        test.save!
      end
    end
  end
end
