class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code, :set_task

  def post
    upload @code, @task do |out, err, status|
      res = {output: out, error: err, code: status.exitstatus }
      puts res
      json_response res
    end
  end

  # Look up the current code from the user and step

  private
  def compile_params
    params.require(:compile).permit(:step_id, :user_id, :code, :task)
  end

  # TODO this is dumb and I should use a parser generator to perform source manipulation.

  def set_code
    @code = '#include "Arduino.h"' + "\n" + params[:code].to_s
  end

  def set_task
    @task = params[:task] || 'device'
  end
end
