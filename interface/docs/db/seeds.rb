# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

# ActionCable linkage
note = Note.create!(text: 'hello!', id: 1)

# Application Data
user = User.create(
  name: 'Quentin',
  email: 'q@q.com'
)

tuto = Tutorial.create(
  user_id: user.id,
  title: 'sample',
  description: 'a test tutorial')

#test = Test.create()

steps = []
3.times |i|
steps << Step.create(
  user_id: user.id,
  tutorial_id: tuto.id,
  title: 'sample step',
  description: 'a step in the right direction')
end
