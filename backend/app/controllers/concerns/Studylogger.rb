require 'pp'

module Studylogger

  def log_user_act (event_name, *arg)
    puts "--- BEGIN #{event_name}"
    puts "--- TIME #{Time.now().to_i}"
    puts "--- USER #{current_user.id} - #{current_user.email}" if current_user
    pp arg
    puts "--- END #{event_name}"
  end

end
