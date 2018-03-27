# lib/tasks/db.rake
namespace :db do
  desc 'Drop, create, migrate then seed the development database'
  task reseed: [ 'db:drop', 'db:create', 'db:migrate', 'db:seed' ] do
    puts 'Reseeding completed.'
  end

  namespace :seed do
    desc "Rebuild tutorials from YAML seed."
    task :tutorial => :environment do
      puts "=== Rebuild tutorials from YAML seed done."
      [Tutorial, Test, Step, Progress, ProgressDatum].map(&:delete_all)
      Rake::Task["db:seed"].invoke
      puts "=== Rebuild done."
    end
  end
end
