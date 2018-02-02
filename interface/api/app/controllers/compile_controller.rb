class CompileController < ApplicationController
  include Hardware

  before_action :assign_code

  def post
    upload @code do |out|
      puts out

      # return a response
      json_response(params)
    end
  end

  alias :get :post

  private

  def assign_code
    puts params
    prog = Progress.where(
      step_id: params[:step],
      user_id: params[:user],
    )

    puts prog

    # TODO encode the programming code in that progress step
    @code = File.read asset_path('basic.ino')

  end
end
