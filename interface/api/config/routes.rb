# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do

  resources :notes
  resources :users
  resources :steps
  resources :tests
  resources :tutorials
  resources :progresses
  resources :progress_data

  get '/prog', to: 'progresses#show'

  post '/compile' => 'compile#post'

  mount ActionCable.server => '/cable'

end
