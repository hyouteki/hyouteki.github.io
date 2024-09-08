+++
title = "Basic Unix Shell"
date = 2023-01-19
authors = ["hyouteki"]
description = "A basic Unix shell in C which implements several commands of shell. Used fork() and exec() system-calls to implement the different commands of the shell, with the added choice of running the command via threads or processes."
[taxonomies]
tags = ["c", "shell", "unix", "systems"]
+++

A basic Unix shell in C which implements several commands of shell. Used fork() and exec() system-calls to implement the different commands of the shell, with the added choice of running the command via threads or processes.

## Quick Start
``` bash
git clone https://github.com/hyouteki/Unix-Shell
cd Unix-Shell
make install
make compile
./shell
```

## Constraints
- Max characters in a command is 100
- Max words in a command is 10

## Commands
| Command | Information |
| :-: | :- |
| cd | change directory |
| pwd | present working directory |
| exit | exit shell |
| ls | `-a`: list all files(including hidden)<br>`-m`: list comma seperated |
| cat | `-E`: print file contents with line endings<br>`-n`: print file contents with line numbers |
| date | current date & time |
| mkdir | `-m`: make directory with specific permissions<br>`-v`: make directory with verbose information |
| rm | `-i`: remove file with confirmation<br>`-v`: remove file with verbose information |
| help | list commands |
| echo | echo something to shell |
| clear | clear shell |
| `&t` | add this after any command to execute it via thread |

<br>
<a class="inline-button" href="https://github.com/hyouteki/Unix-Shell" style="margin: 10px;">Repository</a>