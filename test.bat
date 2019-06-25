REM Script to launch npm test without using the wrong database
REM (Thought to be use locally as a dev tool)
cd prisma

REM Start prisma docker if needed
if [%1]==[] goto DO_TEST
    docker-compose up -d

:DO_TEST

REM Target prisma test database
cd test
call npx prisma deploy

REM Do tests
call npm test

REM Back to prisma "prod" database
cd ..
call npx prisma deploy

REM Stop prisma docker if has been started
if [%1]==[] goto END
    docker-compose down

:END