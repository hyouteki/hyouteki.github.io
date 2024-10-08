+++
title = "irl - Intermediate Representation Language"
date = 2024-08-16
authors = ["hyouteki"]
description = "A simpler version of what LLVM is at its core; \"An optimizer and transpiler of its very own LLVM IR to various architecture's ISA\"."
[taxonomies]
tags = ["rust", "llvm", "compiler", "fasm", "wasm", "graphviz", "systems"]
[extra]
disclaimer = "Work in progress..."
+++

Planned to be a simpler version of what LLVM is at its core; "An optimizer and transpiler of its very own LLVM IR to various architecture's ISA".

### Grammar
``` asm
function L, n
arg id
id = op
id = op1 arith op2
id = unary op
goto L
label L
if (op1 relop op2) goto L
id = op1 relop op2
param op
id = call L, n
ret op
```

### IRL Architecture
<img src="https://github.com/hyouteki/irl/blob/master/resources/irl-architecture.jpg?raw=true" width="1200"/>

In the IRL architecture, the initial step involves converting the source code into an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (Abstract Syntax Tree) using the frontend ([`fe`](https://github.com/hyouteki/irl/tree/master/src/fe)) module. The resulting AST then passes through a middleware ([`mw`](https://github.com/hyouteki/irl/tree/master/src/mw)) module that invokes AST passes for correction and validation. Two default AST passes include [`validate_iden_pass`](https://github.com/hyouteki/irl/tree/master/src/mw/validate_iden_pass.rs), which ensures all identifiers used in instructions are valid, and [`add_goto_pass`](https://github.com/hyouteki/irl/tree/master/src/mw/add_goto_pass.rs), which inserts `goto` statements before necessary label instructions.

The corrected AST then proceeds to the optimization ([`opt`](https://github.com/hyouteki/irl/tree/master/src/opt)) module, where it is transformed into a [CFG](https://en.wikipedia.org/wiki/Control-flow_graph) (Control Flow Graph). This module applies Compiler Passes to the CFG to optimize it, including [`reduce_pass`](https://github.com/hyouteki/irl/tree/master/src/opt/reduce_pass.rs) for simplifying the CFG, [`constant_fold_pass`](https://github.com/hyouteki/irl/tree/master/src/opt/constant_propagation_pass.rs) for folding constants, and `reaching_definition_pass` for eliminating redundant instructions.

The optimized CFG is then passed to the translation ([`trn`](https://github.com/hyouteki/irl/tree/master/src/trn)) module, which translates it into assembly code tailored to the target architecture.

### Supported Targets
| flag                   | Status         | Notes                            |
|------------------------|----------------|----------------------------------|
| `fasm-linux-x86_64`    | ✔️ Supported   | Full functionality available     |
| `fasm-windows-x86_64`  | ✖️ Planned     | Future support under development |
| `wasm`                 | ✖️ Planned     | Future support under development |

### Getting Started
``` asm
function fib, 1
  arg n
  a = 0
  b = 1
  i = 1
  label begin
    if (i == n) goto end
    t = b
    b = a + b
    a = t
    i = i + 1
    goto begin
  label end
    ret b

function main, 0
  param 6
  a = call fib, 1
  param a
  tmp = call print, 1
  ret 0
```
``` console
$ cargo run -- compile -r -f ./eg/fib.irl --cfg --fasm-linux-x86_64
8
$ echo $?
0
```
> Generated control flow graph of this example
>
> <img src="https://github.com/hyouteki/irl/blob/master/eg/fib.dot.svg?raw=true" width="1200"/>

### CLI Documentation
```md
Compile source code to target(s)

Usage: irl.exe compile [OPTIONS] --filepath <filepath>

Options:
  -f, --filepath <filepath>  Source file path
      --cfg                  Output control flow graph of the program as a svg
  -d, --debug                Dumps debug info onto stdout
  -v, --verbose              Sets info level to verbose
  -r, --run                  Runs the binary after compilation
      --wat                  Generates WAT (Web Assembly Text)
      --wasm                 Generates WASM (Web Assembly)
      --fasm-linux-x86_64    Generates FASM (Flat Assembly)
  -h, --help                 Print help
```

### [Emacs mode](https://github.com/hyouteki/irl/tree/master/editor_plugins/)
<img src="https://github.com/hyouteki/irl/blob/master/editor_plugins/resources/irl-mode.png?raw=true" width="1200"/>

### Examples
- [Fibonacci](./eg/fib.irl)
- [Constant Propagation Analysis test](./eg/constant_propagation_test.irl)

### Dependencies
- [graphviz - Graph Visualization Tools](https://graphviz.org/download/)
- [flatassembler - tgrysztar](https://flatassembler.net/)
- [wabt - webassembly](https://github.com/WebAssembly/wabt)

### Courtesy
- [fasm-mode - emacsattic](https://github.com/emacsattic/fasm-mode/)
- [simpc-mode - simple c mode for emacs - rexim](https://github.com/rexim/simpc-mode)

<br>
<a class="inline-button" href="https://github.com/hyouteki/irl" style="margin: 10px;">Repository</a>
<a class="inline-button" href="https://github.com/hyouteki/irl/blob/main/LICENSE" style="margin: 10px;">License GPL-3.0</a> 