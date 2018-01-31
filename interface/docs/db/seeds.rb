# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

user = User.create(
  name: 'Quentin',
  email: 'q@q.com'
)

tuto = Tutorial.create(
  user_id: user.id,
  title: 'sample',
  description: 'a test tutorial'
)

