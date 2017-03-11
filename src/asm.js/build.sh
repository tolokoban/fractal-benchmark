#!/bin/bash

rm a.out.js
emcc -O1 -s ASM_JS=1 ./compute.c
