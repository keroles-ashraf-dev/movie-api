# Movie api

## Prerequisites

1- docker<br/>
2- docker-compose


### Test

> You can find postman collection in docs dir, and coverage reports will appear after run tests in root dir.<br/>

1- Run unit tests
```console
npm run test
```

### Setup

1- copy .env file
```console
cp .env.example .env
```
2- add "TheMovieDB Api Key" to .env file

3- build images and run containers
```console
docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose-dev.yml --env-file ./.env up 
```
