require 'json'
require 'pp'

TUT_ID = '1'
LEADER = /^=*> /
EXPMNT = [9, 45, 15, 66, 20, 24]
CONTROL = [61, 89, 32, 13]
FOUR5 = 45 * 60

# Helper to check is JSON corrupt.

def valid_json?(json)
    JSON.parse(json)
    return true
  rescue JSON::ParserError => e
    return false
end

# Todo: define better END condition

puts 'reading study.log...'
raw_events = %x{grep '==============>' ../backend/study.log}

puts 'parsing study.log...'
u_events = raw_events.split("\n")
  .map {|e| e.sub(LEADER, '') }
  .select {|e| valid_json? e }
  .map {|e| JSON.parse e }
  .group_by {|e| e['user'] }
  .select {|k, v| k =~ /.*user.*/ }
  .map {|k, v| [k.sub(/.*user/, '').to_i, v] }
  .map {|k, v| [k, v.map {|e| e.delete('user'); e  }] }
  .select {|k, v| (EXPMNT + CONTROL).include? k }
  .map do |user, events| # group data for each user
    events.map {|e| e['args'] = JSON.parse(e['args']).first; e }
    user_data = {}
    user_data[:user] = user
    user_data[:control] = CONTROL.include? user_data[:user]
    first_event = events.find {|e| e['name'] == "user-update" && e['args']['current_tutorial'].to_i > 0 }
    user_data[:start] = first_event.nil?? 0 : first_event['time']
    true_last = events.sort_by {|e| e['time'] }.last['time']
    user_data[:end] = true_last
    user_data[:data] = events
      .group_by {|e| e['name'] }
      .map do |k, evs|
      v_filter  = evs
        .select {|x| x['args']['code'].nil? } # ignore for now.
        .select {|x| x['time'] >= user_data[:start] }
        .select {|x| x['time'] <= user_data[:start] + FOUR5 }
      [k, v_filter]
    end.to_h
  user_data
end

#puts "participants offsets..."

puts "parsed participants:"
clean_data = JSON.pretty_generate(u_events)
u_events.map{|u| u[:data] = u[:data].length; pp u }

puts "emitting data.js..."
file_data = "var data = #{clean_data}"
File.write('data.js', file_data)
