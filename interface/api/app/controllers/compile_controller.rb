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

    res = {output: out, error: err, code: ioproc.exitstatus }
    puts res
    json_response res
  end

  def post_channel
    # TODO use action channel to stream data from the serial line rather than using
  end

  # Look up the current code from the user and step

  private
  def compile_params
    params.require(:compile).permit(:step_id, :user_id, :code, :task)
  end

  # TODO this is dumb and I should use a parser generator to perform source manipulation.
  # ALSO UIST IS COMING UP VERY SHORTLY SO PERHAPS DONT DO IT YET

  def set_code
    @code = '#include "Arduino.h"' + "\n" + params[:code].to_s
  end

  def set_task
    @task = params[:task] || 'device'
  end
end
