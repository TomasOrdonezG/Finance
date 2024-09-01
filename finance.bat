@echo off

start wt -w 0 nt -p "Command Prompt" cmd /k "cd \"C:\Users\samal\OneDrive\Desktop\Programs\websites\Personal Finance\server\" && node ."

start wt -w 0 nt -p "Command Prompt" cmd /k serve -s "C:\Users\samal\OneDrive\Desktop\Programs\websites\Personal Finance\client\build" -l 3000

start firefox "localhost:3000"