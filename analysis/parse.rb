require 'json'
require 'pp'
require 'csv'

def m(x); return x * 60; end
LEADER = /^=*> /
EXPMNT = [9, 45, 15, 66, 20, 24]
CONTROL = [37, 89, 32, 13, 78, 50]
TUT_ID = ['9', '12'] # everything that is not the demo tutorial

TIMED = {
  9 => m(45),
  45 => m(27),
  15 => m(37),
  66 => m(42),
  20 => m(43),
  24 => m(45),
  37 => m(38),
  89 => m(41),
  32 => m(45),
  13 => m(45),
  78 => m(45),
  50 => m(45),
}

OFFSET = {
  15 => {s: m(21), o: m(6)},
  78 => {s: m(22), o: -m(5)}
}

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
  first_event = events.find {|e| e['name'] == "user-update" && TUT_ID.include?(e['args']['current_tutorial']) }
  user_data[:start] = first_event.nil?? 0 : first_event['time']
  #true_last = events.sort_by {|e| e['time'] }.last['time']

  user_off = OFFSET[user]
  if !user_off.nil?
    events = events.map do |x|
      start = user_data[:start] + user_off[:s]
      if x['time'] <= start # keep
        x
      elsif x['time'] <= start + user_off[:o] # delete
        nil
      else # shift back
        x['time'] -= user_off[:o]
        x
      end
    end.reject(&:nil?)
  end

  user_data[:end] = user_data[:start] + TIMED[user]
  user_data[:data] = events
    .group_by {|e| e['name'] }
    .map do |k, evs|
    v_filter  = evs
      .select {|x| x['args']['code'].nil? } # ignore for now.
      .select {|x| x['time'] >= user_data[:start] }
      .select {|x| x['time'] <= user_data[:end] }
    [k, v_filter]
  end.to_h
  user_data
end

puts "parsed participants:"
clean_data = JSON.pretty_generate(u_events)
u_events.map do |u|

  u[:data]['progress-update'] =
    [{'user': u[:user], 'control': u[:control], 'time-seconds': 0, 'step': 1}] + u[:data]['progress-update'].map do |x|
    x[:user] = u[:user]
    x['time'] -= u[:start]
    x['control'] = u[:control]
    x['time-seconds'] = x['time']
    x['step'] = x['args']['position']
    x.delete('args')
    x.delete('name')
    x.delete('time')
    x
  end
  #u[:data] = u[:data].length
  #puts u.to_json
end

puts "emitting data.js..."
file_data = "var data = #{clean_data}"
File.write('data.js', file_data)

puts "emitting data.csv..."
all_events = u_events.reduce([]) {|memo, x| memo += x[:data]['progress-update'] }
column_names = all_events[2].keys
s=CSV.generate do |csv|
  csv << column_names
  all_events.each do |x|
    csv << x.values
  end
end
File.write('data.csv', s)
