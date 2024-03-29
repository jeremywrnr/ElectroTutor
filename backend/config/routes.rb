# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do

  resources :notes
  resources :users
  resources :steps
  resources :tutorials
  resources :progress_data

  get '/test_unlock', to: 'tests#test_unlock'
  get '/test', to: 'tests#step'
  resources :tests

  get '/prog', to: 'progresses#show'
  resources :progresses

  post '/compile' => 'compile#post'
  post '/show_vars' => 'compile#show'
  post '/measure' => 'compile#measure'
  post '/autoupload' => 'compile#autoupload'
  mount ActionCable.server => '/cable'

  post 'user_token', to: 'user_token#create'

end
