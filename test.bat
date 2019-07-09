REM Script to launch npm test without using the wrong database
REM (Thought to be use locally as a dev tool on Windows)

set watch=0

REM Get parameters
:LOOP
if [%1]==[] goto CONTINUE
    if [%1]==[-w] (
        set watch=1
    )
shift
goto LOOP
:CONTINUE

REM Begin script
cd prisma/test

REM Start prisma docker
docker-compose up -d

REM Target prisma test database
call npx prisma deploy

REM Do tests
if "%watch%" == "0" (
    call npm run test
)
if "%watch%" == "1" (
    call npm run watch-test
)

REM Stop prisma docker
docker-compose down
cd ../..
