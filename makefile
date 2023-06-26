all:
	gcc -oFast ./src/main.c -o ./dist/public/main.exe

debug:
	gcc ./src/main.c -o ./dist/public/main.exe