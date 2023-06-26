all:
	gcc -oFast ./src/main.c -o main.exe

debug:
	gcc ./src/main.c -o main.exe