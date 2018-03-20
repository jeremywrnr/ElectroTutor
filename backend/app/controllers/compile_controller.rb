class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code, :set_task

  def post
    out = ''
    err = ''

    ioproc = upload @code, @task do |stdin, stdout, stderr, wait_thr|
      pid = wait_thr.pid # pid of the started process.
      stdin.close
      out = stdout.read
      err = stderr.read
      wait_thr.value
    end

    pout = process_output_message out
    perr = process_error_message err
    res = {output: pout, error: perr, code: ioproc.exitstatus }
    puts res
    json_response res
  end

  private
  def compile_params
    params.require(:compile).permit(:code, :task)
  end

  def set_code
    user_code = params[:code].to_s
    if user_code.empty?
      @code = ''
    else
      @code = '#include "Arduino.h"' + "\n" + user_code
    end
  end

  def set_task
    @task = params[:task] || 'device'
  end
end
