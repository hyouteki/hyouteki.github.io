+++
title = "Kappa - Compiler in Rust"
date = 2023-11-18
authors = ["hyouteki"]
description = "Compiler implementation for a bespoke statically typed language from scratch written entirely in Rust, which is capable of compiling a program down to native x86_64 assembly."
[taxonomies]
tags = ["rust", "compiler", "nasm", "x86_64", "systems"]
[extra]
disclaimer = "Work in progress..."
+++

Compiler implementation for a bespoke statically typed language from scratch written entirely in Rust, which is capable of compiling a program down to native x86_64 assembly.

``` js
fn fib(n: int): int {
    if (n <= 0) {
        print("Invalid\n");
        return 0;
    }
    if (n < 2) {
        return n;
    }
    return fib(n-1) + fib(n-2);
}

fn main(): int {
    print(fib(4), "\n");
    return 0;
}
```

## Quick Start
``` bash
git clone https://github.com/hyouteki/kappa
cd kappa
```

``` bash
cargo run -- compile --felf64 -f ./eg/main.K
nasm -felf64 ./eg/main.asm -o ./eg/main.o
ld ./eg/main.o -o ./eg/main
./eg/main
```

<br>
<a class="inline-button" href="https://github.com/hyouteki/kappa" style="margin: 10px;">Repository</a>
<a class="inline-button" href="https://github.com/hyouteki/kappa/blob/main/LICENSE" style="margin: 10px;">License MIT</a> 
