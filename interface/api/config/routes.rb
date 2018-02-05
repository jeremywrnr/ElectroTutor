# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resources :notes
  resources :users
  resources :steps
  resources :tutorials
  resources :progresses

  # compile for the current user
  post '/compile' => 'compile#post'

  # thinking about progress...
  # https://stackoverflow.com/questions/4641325/rails-has-many-and-routing

  mount ActionCable.server => '/cable'
end
