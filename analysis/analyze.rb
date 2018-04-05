require 'pp'
require 'csv'
require 'json'

output= {}
steps = {}
csv = CSV.read("data-complete.csv", headers: true)
csv.map {|r|
  user = r['user']
  if steps[user].nil?
    steps[user] = [r.to_hash]
  else
    steps[user].push r.to_hash
  end
}

# for each user
output = steps.map do |user, acts|

  # Sort by time
  backjumps = 0
  sorted = acts
    .map {|us| us['step'] = us['step'].to_i; us }
    .map {|us| us['time-seconds'] = us['time-seconds'].to_i; us }
    .sort_by {|us| us['time-seconds'] }

  # Iterate in pairs
  sorted.each_cons(2) do |cur, nex|
    # Get position list
      backjumps += 1 if nex['step'] < cur['step']
  end

  {
    user: user,
    control: acts.first['control'],
    backjumps: backjumps,
  }
end


clean_data = JSON.pretty_generate({data: output})
puts clean_data
