Rails.application.routes.draw do
  resources :notes
  resources :users

  # compile for the current user
  post '/compile' => 'compile#post'

  mount ActionCable.server => '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
