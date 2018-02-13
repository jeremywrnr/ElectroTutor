class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code

  def post
    upload @code do |out, err, status|
      res = {output: out, error: err, code: status.exitstatus }
      puts res
      json_response res
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
