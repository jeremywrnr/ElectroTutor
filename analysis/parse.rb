require 'json'
require 'pp'

TUT_ID = '1'
LEADER = /^=*> /
CONTROL = [57]

# Todo: define better END condition

puts 'reading study.log...'
raw_events = %x{grep '==============>' ../backend/study.log}

puts 'parsing study.log...'
u_events = raw_events.split("\n")
  .map {|e| JSON.parse e.sub(LEADER, '') }
  .group_by {|e| e['user'] }
  .select {|k, v| k =~ /.*user.*/ }
  .map {|k, v| [k, v.map {|e| e.delete('user'); e  }] }
  .map do |user, events| # group data for each user
    events.map {|e| e['args'] = JSON.parse(e['args']).first; e }
    user_data = {}
    user_data[:user] = user.sub(/.*user/, '').to_i
    user_data[:control] = CONTROL.include? user_data[:user]
    user_data[:start] = events.find {|e|
      e['name'] == "user-update" && e['args']['current_tutorial'] == TUT_ID }['time']
    user_data[:end] = events.sort_by {|e| e['time'] }.last['time']
    user_data[:data] = events
      .group_by {|e| e['name'] }
      .map do |k, evs|
      v_filter  = evs
        .select {|x| x['args']['code'].nil? } # ignore for now.
        .select {|x| x['time'] >= user_data[:start] }
      [k, v_filter]
    end.to_h
  user_data
end

puts "parsed participants:"
u_events.map{|u| u[:data] = u[:data].length; pp u }
clean_data = JSON.pretty_generate(u_events)

puts "emitting data.js..."
file_data = "var data = #{clean_data}"
File.write('data.js', file_data)
