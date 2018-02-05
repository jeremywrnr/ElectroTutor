# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resources :notes
  resources :users
  resources :steps
  resources :tutorials
  resources :progresses

  # compile for the current user
  post '/compile' => 'compile#post'

  mount ActionCable.server => '/cable'
end
