#/bin/bash

# See: https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm

emcc -o compute.js compute.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_compute']" -s BINARYEN_METHOD="native-wasm"
