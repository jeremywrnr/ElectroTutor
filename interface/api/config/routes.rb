# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do

  resources :notes
  resources :users
  resources :steps

  resources :tutorials
  resources :progress_data

  get '/test', to: 'tests#step'
  resources :tests

  get '/prog', to: 'progresses#show'
  resources :progresses

  post '/compile' => 'compile#post'

  get '/authenticate' => 'authenticate'

  mount ActionCable.server => '/cable'

end
