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

  def show
    idt = idents(@code)
    render json: idt
  end

  def measure
    out = ''
    err = ''
    idt = compile_params[:idents]
    instrumented = instrument @code, idt.join(",") # [] => Str
    puts idt, instrumented

    ioproc = upload instrumented, 'device' do |stdin, stdout, stderr, wait_thr|
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

  def autoupload
    out = ''
    err = ''
    code = autoLoader compile_params[:file]

    ioproc = upload code, 'device' do |stdin, stdout, stderr, wait_thr|
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

  # Setting route parameters

  private
  def compile_params
    params.require(:compile).permit(:code, :task, :file, idents: [])
  end

  def set_code
    @code =  params[:code] || ''
  end

  def set_task
    @task = params[:task] || 'device'
  end
end
