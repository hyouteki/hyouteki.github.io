#!/bin/bash
set -x -e

MODULE_NAME="module"
WARNS=("all" "extra" "switch-enum")
EXPORT_SYMBOLS=("hash", "hash_len")

clang -Os -fno-builtin ${WARNS[@]/#/-W} --target=wasm32 \
	  --no-standard-libraries ${EXPORT_SYMBOLS[@]/#/"-Wl,--export="} \
	  -Wl,--no-entry -Wl,--allow-undefined \
	  -o ${MODULE_NAME}.wasm ${MODULE_NAME}.c

wasm2wat ${MODULE_NAME}.wasm > ${MODULE_NAME}.wat
