class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code

  def post
    upload @code do |out|
      puts out

      # return a response
      json_response(compile_params)
    end
  end

  private
  # Look up the current code from the user and step
  def compile_params
    params.require(:compile).permit(:step_id, :user_id)
  end

  def set_code
    prog = Progress.where(
      step_id: params[:step_id],
      user_id: params[:user_id],
    )

    # TODO encode the programming code in that progress step
    puts prog

    @code = File.read "#{Rails.root}/app/assets/basic.ino"
  end
end
