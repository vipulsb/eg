## Description

To run this application, you would require

- Docker setup in your machine

## Running the app

#### env set up

create a `.env` file and add the following:

```
ENV=development
DB_USERNAME=admin
DB_PASSWORD=adminpassword
DB_HOST=mongodb
DB_PORT=27017
DB_NAME=default
APP_PORT=3000
AUTH_SECRET=secret_value

LOG_LEVEL=debug
```

In your terminal, please run

```bash

$ npm run build
$ docker compose up --build
```

- This will setup all the dependencies and run the application on the port 3000.

## Test

```bash
# unit tests 
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tech used

- NestJs
- React
- MongoDB
- Zustand
- Tailwind CSS (experimented with Tailwind for the first time)
- Webpack

## Possible improvements

- Test cases especially on the client aren't exhaustive and can be improved
- UI components could be more granular and better organized
