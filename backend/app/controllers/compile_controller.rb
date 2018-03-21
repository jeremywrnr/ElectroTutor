class CompileController < ApplicationController
  include Hardware

  before_action :compile_params, :set_code, :set_task

  def show_vars
    render json: idents
  end

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
    @code =  params[:code].to_s || ''
  end

  def set_task
    @task = params[:task] || 'device'
  end
end
