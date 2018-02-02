class CompileController < ApplicationController
  def post
    puts params
    json_response(params)
  end

  alias :get :post
end
