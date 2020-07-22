#! /bin/bash
yarn build
ts-node ./node_modules/typeorm/cli.js migration:generate -n jello -c production
ts-node ./node_modules/typeorm/cli.js migration:run -c development
heroku container:push web
heroku container:release web