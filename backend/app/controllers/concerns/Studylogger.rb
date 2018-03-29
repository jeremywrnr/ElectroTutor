require 'pp'

module Studylogger

  def log_user_act (event_name, *arg)
    data_event = {
      name: event_name,
      time: Time.now().to_i,
    }

    data_event[:user] = "#{current_user.id}:#{current_user.email}" if current_user
    data_event[:args] = arg.to_json if arg
    puts "==============> #{data_event.to_json}"
  end

end
