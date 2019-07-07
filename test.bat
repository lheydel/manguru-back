REM Script to launch npm test without using the wrong database
REM (Thought to be use locally as a dev tool on Windows)

set docker=0
set watch=0

REM Get parameters
:LOOP
if [%1]==[] goto CONTINUE
    if [%1]==[-d] (
        set docker=1
    )
    if [%1]==[-w] (
        set watch=1
    )
shift
goto LOOP
:CONTINUE

REM Begin script
cd prisma

REM Start prisma docker if needed
if "%docker%" == "1" (
    docker-compose up -d
)

REM Target prisma test database
cd test
call npx prisma deploy

REM Do tests
if "%watch%" == "0" (
    call npm run test
)
if "%watch%" == "1" (
    call npm run watch-test
)

REM Back to prisma "prod" database
cd ..
call npx prisma deploy

REM Stop prisma docker if has been started
if "%docker%" == "1" (
    docker-compose down
)
