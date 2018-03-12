# rails backend for persistent data

_works as a json api_

app installation:

    bundle install

database initialization:

    bin/rails db:environment:set RAILS_ENV=development db:drop db:create db:migrate db:seed

run the test suite:

    rake

start the server with `conda` py2.7 env:

    ./start

### links

* rails guide: https://www.railstutorial.org/book/modeling_users
* rails channels: https://engineering.musefind.com/make-your-rails-app-real-time-in-under-ten-minutes-cd5bd4a47f61
