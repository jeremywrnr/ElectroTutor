class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code

  def post
    upload @code do |out|
      puts out

=begin
    prog = Progress.where( step_id: params[:step_id], user_id: params[:user_id],)
    # TODO encode the programming code in that progress step
    # @code = File.read "#{Rails.root}/app/assets/basic.ino"
    puts prog
=end

      json_response compile_params, out
    end
  end

  private
  # Look up the current code from the user and step
  def compile_params
    params.require(:compile).permit(:step_id, :user_id, :code)
  end

  def set_code
    @code = '#include "Arduino.h"' + "\n" + params[:code]
  end
end
