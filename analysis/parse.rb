require 'json'
require 'pp'

LEADER = /^=*> /

puts 'reading study.log'
raw_events = %x{grep '==============>' ../backend/study.log}

puts 'parsing study.log'
events = raw_events.split("\n").map {|e| JSON.parse e.sub(LEADER, '') }
u_events = events.group_by {|e| e['user'] }.select {|k, v| k =~ /.*user.*/ }

# u_events => filtered by study users, k-v pair where:
#   k : full user key
#   v : array of events

pp u_events

return

puts 'emitting data.js'
File.write('data.js', events.to_s)

