#! /bin/bash
yarn build
heroku container:push web
heroku container:release web