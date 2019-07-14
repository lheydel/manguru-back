REM Script to launch npm test without using the wrong database
REM (Thought to be use locally as a dev tool on Windows)

set build=0
set docker=0
set watch=0

REM Get parameters
:LOOP
if [%1]==[] goto CONTINUE
    if [%1]==[-b] (
        set build=1
    )
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
cd prisma/test

REM Start prisma docker
if "%docker%" == "1" (
    call docker-compose up -d
)

REM Target prisma test database
call timeout /t 5 /nobreak > NUL
call npx prisma deploy
call npx prisma generate

REM Remove jest cache to use new version of the app
if "%build%" == "1" (
    call npx jest --clearCache
)

REM Do tests
if "%watch%" == "0" (
    call npm run test
)
if "%watch%" == "1" (
    call npm run watch-test
)

REM Stop prisma docker
if "%docker%" == "1" (
    call docker-compose down
)

REM Target prisma "prod" database
cd ..
call npx prisma generate

cd ..
