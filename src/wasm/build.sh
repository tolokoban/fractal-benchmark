#/bin/bach
emcc -o compute.js compute.c -lm -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_compute']" -s BINARYEN_IMPRECISE=1
