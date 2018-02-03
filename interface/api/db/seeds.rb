# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

require './example.rb'

# Application Data
user = User.create(
  name: 'Quentin',
  email: 'q@q.com',
  password_digest: 'q@q.com',
  tutorial: 1,
  step: 1,
)

tuto = Tutorial.create(
  user_id: user.id, # authorship
  title: 'Gyroscope Fun with NeoPixel Rings',
  description: %{
In this project, we'll combine a gyroscope and NeoPixels to build a
device that lights LEDs corresponding to the angle of inclination.
  },
)

steps = []
descriptions.each do |d|
  steps << Step.create(
    tutorial_id: tuto.id,
    description: d.desc,
    title: d.title,
  )
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
