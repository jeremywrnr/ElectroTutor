Rails.application.routes.draw do
  resources :notes
  resources :users

  # compile and upload code for the current user
  post '/compile/:id' => 'compile#post'
  get '/compile/:id' => 'compile#post'

  mount ActionCable.server => '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
