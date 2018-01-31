# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

# ActionCable linkage (live db updates)
note = Note.create!(text: 'hello!', id: 1)

# Application Data
user = User.create(
  name: 'Quentin',
  email: 'q@q.com',
  password_digest: 'q@q.com'
)

tuto = Tutorial.create(
  user_id: user.id,
  title: 'sample',
  description: 'a test tutorial')

size = 3
steps = []
size.times do |i|
  steps << Step.create(
    tutorial_id: tuto.id,
    title: 'sample step',
    description: 'a step in the right direction')
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

