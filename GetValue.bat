@echo off

:loop
node C:\Disk\Case\NodeJS\Case\GetValue\GetValue.js
timeout /t 5 > nul
goto :loop