+++
title = "exploring COmpiler OPtimizations"
date = 2024-02-21
authors = ["hyouteki"]
description = "Repository for exploring compiler optimizations. Includes writing a null pointer de-reference detection compiler pass, garbage collector SafeGC for C lang and Spatial & weaker type safety for the C lang via disallowing out-of-bound pointer accesses and storage of invalid addresses."
[taxonomies]
tags = ["c", "cpp", "llvm", "safe-gc", "compiler-pass", "type-safety", "probe", "systems"]
[extra]
toc = true
+++

# Null pointer dereference detection compiler pass

## Building the pass from scratch
``` bash
git clone https://github.com/Systems-IIITD/CSE601
git clone https://github.com/hyouteki/cop
mv cop/nullchecks/NullChecks.cpp CSE601/llvm/lib/CodeGen/SafeC/
sudo apt install cmake ninja-build
```
``` bash
cd CSE601
mkdir build
cd build && cp ../scripts/build.sh . && sh build.sh && ninja -j 4
cd tests && make
```

> **Note**: If you encounter error such as
> ``` bash
> /home/puneetku/CSE601/llvm/utils/benchmark/src/benchmark_register.h:17:30: error: ‘numeric_limits’ is not a member of ‘std’
> 17 |   static const T kmax = std::numeric_limits<T>::max();
> ```
> Try adding `#include<limits>` in the header file and re-building the project

> **Note**: For subsequent builds just run `cd build && ninja -j 4` inside `CSE601` directory

> **Note**: For testing the pass run the following command `cd tests/PA1/ && make clean && make -B` inside `CSE601` directory

## How does this work
There are mainly 4 instructions that may lead to segmentation faults while dereferencing null pointers.

1. Store
2. Load
3. GetElementPtr
4. Call (Indirect)

> **Naïve solution:** Adding nullchecks before every instructions of these four types. But it will lead to multiple compare and conditional branch instructions.
> 

Better solution for this is to use forward data flow analysis to track every pointer and add nullchecks only when we are unsure of it being null safe. *(Similar to constant propagation data flow analysis)*

### For this we have 2 maps:
``` c++
std::unordered_map<Value *, std::unordered_set<Value *>> childPointers;
std::unordered_map<Value *, bool> unsafePointers;
```

- `childPointers` maps each pointer to a set of its child pointers. Or in other words every child pointer’s value is dependent upon its parent pointer.
    
    ```cpp
    %a = load i32*, i32** %a.addr;
    ```
    
    > In this example `%a` is the child pointer of `%a.addr`. As if the value of `%a.addr` changes the value present in `%a` is corrupted and new value may not be null safe.
    
- `unsafePointers` just tells whether a pointer present in the map is unsafe or not.

> The `childPointers` map is preserved through out the function, but the `unsafePointers` map resets at each basic block. As from any basic block, one can reach any basic block. Thus any basic block could have modified the pointer thus making them unsafe, so we can't rely on previous observations.

## Forward data flow analysis

- There are two APIs first is `includeInst` and `processInst`.
- `includeInst` takes in the instruction and both maps. And outputs whether we should add nullchecks for this instruction.
- `processInst` adds nullchecks for the given instruction.
- The transfer functions are present in the `includeInst`.

## Transfer function
> Function definition an be found [@](https://github.com/hyouteki/cop/blob/b808590a4f501e6febeacfb7e6014e468da4f78b/nullchecks/NullChecks.cpp#L81-L112)

Adding nullchecks for current instruction will depend upon `unsafePointers[basePointer]`; if the `basePointer` i.e. `%a.addr` present in the `unsafePointers` then the value itself otherwise the `basePointer` is unsafe by default.

1. Store instruction: When storing a value to a pointer it will make the pointer itself and all the child pointers unsafe. As we might have stored null into `%a.addr` thus making it unsafe when using it to load `%a`. 
2. Load instruction: We’ll first add the value operand of the `basePointer` i.e. the loaded value to the `childPointers`.  Then as the loaded pointer is always safe, we’ll write that fact into `unsafePointers`.
3. GetElementPtr instruction: Any pointer returned by this instruction will be checked for nullchecks when it is used. And the fact about it being null space will only be stored then.
4. Call (indirect) instruction: We’ll just make the function pointer safe and `basePointer` in this case is just the function pointer itself. Reasoning behind making the function pointer safe is explained later.
5. Alloca & Icmp instruction: For these instruction, we don’t need to do anything as we are not dereferencing any pointers.
6. Bitcast instruction: Same as alloca instruction we don’t need to do anything as we are just type casting the pointer not dereferencing it.
7. Branch instruction: This clears the `unsafePointers` map. *Reasoning explained above…*
8. Ret instruction: This again does not do anything. 
   > Before returning we will always make the `basePointer` mark as safe. Reasoning is that if the current instructions executes after getting through the nullchecks, it means that the pointer is not null. And is safe to use for the coming instruction using that pointer.
 
## Meet operator
This does not do anything as `childPointers` is preserved through out the function. And `unsafePointers` is empty at the start of each basic block, or in other words it also does not depend upon the incoming `unsafePointers` map from predecessor basic blocks.

## Initialization
At the start of function `childPointers` is 0 initialized and `unsafePointers` is also 0 initialized at the start of each basic block.

## Assumptions

1. Return type of any function is one of these `void`, `int`, `int *`. As the pass is adding default return values as the transmission instructions for the `NullBB` *(exhaustive declaration of return instructions).*
2. Pointers passed in as function parameters are not taken in account of. Alternatively it is assumed that the function will not modify the pointers that are passed to it.
3. This pass is exhaustively tested on the given 8 test cases and may fail on anything outside the scope of those test cases.

## Miscellaneous

- Outputs of all tests are compiled into [nullchecks.out](https://github.com/hyouteki/problm/blob/main/nullchecks/nullchecks.out).
- All the instructions that requires nullchecks are the first instruction of every `NotNullBB`. LLVM IR files are present inside [nullchecks_opt_ll](https://github.com/hyouteki/problm/tree/main/nullchecks/nullchecks_opt_ll).

# Conservative garbage collecter (Safe GC) for Clang

> SafeGC implements a bump allocator that always returns an 8-byte address.

## Building the project
``` bash
git clone https://github.com/hyouteki/cop
cd safegc
make
```

## How does this work
Safe GC has three components: allocator, mark and sweep.

### Requirements
- Heap memory is always allocated via a safe memory management API (e.g., malloc).
- If a heap object (say obj) is live, then the application must store its data in the range `[obj, obj + sizeof(obj)]` in its address space.

### Allocator
Safe GC implements a bump allocator and a stop-the-world conservative garbage collector. The allocator maintains a list of segments. All objects are allocated from a segment. A segment is a 4-GB contiguous memory area. 

![Layout of a Segment](https://github.com/hyouteki/cop/blob/main/safegc/images/segment_layout.jpg?raw=true)
<figcaption>Layout of a segment</figcaption>

Physical pages to the segment memory are allocated on demand. `ReservePtr` points to the end of the segment. `CommitPtr` points to a memory area until which the physical pages have been allocated. `AllocPtr` is the head of the bump allocator. The first 2-MB of the segment is reserved for metadata. The rest of the segment is used by the bump allocator. `DataPtr` points to the first byte in the data region of a segment.

``` c
typedef struct ObjHeader {
    unsigned Size;
    unsigned Status;
    ulong64 Type;
} ObjHeader;
```

SafeGC adds an object header to each object. An object header contains the size, status, and type of the object. SafeGC doesn't use the type field of the object header; reserved for future use. The status field contains the validity of an object. When an object is freed, the status filed of the object is set to `FREE`. The status field can also be used by the mark phase to `MARK` reachable objects. The bump allocator never reuses a virtual address. When a segment is full, a new segment is created for future allocations. `myfree` is called to free an object. myfree reclaims the physical page associated with a virtual page when all the objects on the virtual pages are freed. A virtual page is a 4-KB contiguous memory area in the segment address space. A virtual page is also aligned to 4-KB size. Future accesses to a freed virtual pages result in segmentation faults. SafeGC reserves two bytes metadata corresponding to each virtual page in the segment. The metadata is stored in a contiguous 2-MB memory area at the top of the segment. The virtual page metadata tracks the number of free bytes on a virtual page. When the number of free bytes becomes equal to the size of a virtual page, the corresponding physical page is reclaimed. When the allocation size of an object is less than 4-KB (page size), SafeGC ensures that the object always lies on a single page. The top of a virtual page always contains the starting address (address of object header) of an object. Allocations of size more than 4-KB allocations are called big allocations. SafeGC implements a different allocation scheme for big allocations. For big allocations, the allocation size is adjusted to the nearest multiple of the page size. For these allocations, myfree immediately reclaims the physical pages. The metadata corresponding to the first page of a big allocation is set to one to identify the first byte of these objects. myfree sets the metadata corresponding to all pages of a big allocation to the page size. The metadata can be used by the mark and sweep phase to check the validity of a page before access, and also for the finding the object headers of big allocations.

### Mark
**Scanning roots**: It scans the heap and stack for the 8-bytes aligned valid heap address. After encountering a valid heap address it finds the object header corresponding to that address and `MARK` it if not adready marked and add it to the unscanned objects list. 

After scanning of the roots is complete. It iterates over each heap object in the unscanned objects list and check for references to valid heap addresses in that object. After encountering a valid heap address it proceeds to do the same as mentioned in the scan roots phase. 

### Sweep 
It iterates over all the valid heap addresses and fetch their corresponding object header if an object not marked and not freed is found it proceeds to free them using `myfree` routine.

> **Warning**: Due to viewing all the value which have holds a valid heap address as a pointer to the heap memory; a conservative garbage collector may incorrectly identify unreachable objects (whose addresses matches with an integer) as reachable, which could lead to a memory leak. Fortunately, in most applications, such cases are few, and thus it is practical to implement conservative garbage collection for them.

## Tests
Run tests using `make test`
``` bash
/usr/bin/time -v ./random
total edges:4222800
Num Bytes Allocated: 476002816
Num Bytes Freed: 52107408
Num GC Triggered: 14
printing stats after final GC
Num Bytes Allocated: 476002816
Num Bytes Freed: 53603152
Num GC Triggered: 15
    Command being timed: "./random"
    User time (seconds): 8.36
    System time (seconds): 0.32
    Percent of CPU this job got: 99%
    Elapsed (wall clock) time (h:mm:ss or m:ss): 0:08.70
    Average shared text size (kbytes): 0
    Average unshared data size (kbytes): 0
    Average stack size (kbytes): 0
    Average total size (kbytes): 0
    Maximum resident set size (kbytes): 519588
    Average resident set size (kbytes): 0
    Major (requiring I/O) page faults: 2
    Minor (reclaiming a frame) page faults: 128639
    Voluntary context switches: 73
    Involuntary context switches: 10
    Swaps: 0
    File system inputs: 88
    File system outputs: 0
    Socket messages sent: 0
    Socket messages received: 0
    Signals delivered: 0
    Page size (bytes): 4096
    Exit status: 0
```

# Spatial and weaker type safety for the C lang
> This pass aims to enforce spatial and a weaker type safety for the C language via disallowing out-of-bound pointer accesses and having pointers with invalid addresses.

## Building the pass from scratch
``` bash
git clone https://github.com/Systems-IIITD/CSE601
git clone https://github.com/hyouteki/cop
mv cop/nullchecks/NullChecks.cpp CSE601/llvm/lib/CodeGen/SafeC/
sudo apt install cmake ninja-build
```
``` bash
cd CSE601
mkdir build
cd build && cp ../scripts/build.sh . && sh build.sh && ninja -j 4
cd tests && make
```

> **Note**: If you encounter error such as
> ``` bash
> /home/puneetku/CSE601/llvm/utils/benchmark/src/benchmark_register.h:17:30: error: ‘numeric_limits’ is not a member of ‘std’
> 17 |   static const T kmax = std::numeric_limits<T>::max();
> ```
> Try adding `#include<limits>` in the header file and re-building the project

> **Note**: For subsequent builds just run `cd build && ninja -j 4` inside `CSE601` directory

> **Note**: For testing the pass run the following command `cd tests/PA1/ && make clean && make -B` inside `CSE601` directory

## How does this work
C allows pointer typecasting to non-pointer types and pointer arithmetic. Thus, directly enforcing type checks at runtime is not feasible. To address this, we utilize the `mymalloc` routine, which tracks objects' size and type information, enabling dynamic enforcement of memory safety by storing object metadata just before the object itself.

More than just keeping track of the base pointer is required; as in C, a pointer can be typecasted to unsigned long long and passed to a function. Thus, we must keep track of all the variations (child pointers) of the base pointer (parent pointer).
``` c
int *ptr = (int *)mymalloc(sizeof(int)*1);
unsigned long long a = (unsigned long long)ptr;
```
``` llvm
%ptr_addr = alloca i32*, align 8
%a = alloca i64, align 8	
%mymalloc_call = call noalias i8* @mymalloc(i64 4) #2
%mymalloc_output = bitcast i8* %mymalloc_call to i32*
store i32* %0, i32** %ptr_addr, align 8
%1 = load i32*, i32** %ptr_addr, align 8
%2 = ptrtoint i32* %1 to i64
store i64 %2, i64* %a, align 8
```
> As `a` is not a pointer but dynamically contains a pointer value. Thus we need to keep track of it as well. For this we need to track the pointer going through different instructions such as bitCastInst, getElementPtrInst, etc. In this example `a` is a child pointer of the parent pointer `ptr`.

The first step is to replace every alloca instruction (stack allocation) and malloc call instruction (heap allocation) with a mymalloc call instruction (heap allocation of object and object metadata) so that we have access to the object metadata. For the alloca instruction, we need to determine the size of the requested object, which is done using the custom [getSizeOfAlloca](https://github.com/hyouteki/cop/blob/85915ab3f302626b6d80e7687dd354431654bb06/memsafe/MemSafe.cpp#L67-L80C2) routine. Once the size of the alloca instruction is calculated, we insert a mymalloc API call and include the myfree (equivalent to the free routine) after the last use of the alloca instruction found in the original LLVM IR.

> This is handled by the [replaceAllocaToMymalloc](https://github.com/hyouteki/cop/blob/8c91b14a81bb1a3a23e77d700422e2ac2c6161ab/memsafe/MemSafe.cpp#L82-L191) API.

Next step is to disallow out-of-bounds pointer accesses which is handled by the [disallowOutOfBoundsPtr](https://github.com/hyouteki/cop/blob/8c91b14a81bb1a3a23e77d700422e2ac2c6161ab/memsafe/MemSafe.cpp#L193-L259C2) API. It works by finding all the pointer accesses and adds a call instruction to a custom [isSafeToEscapeFunc](https://github.com/hyouteki/cop/blob/25c99cc5e4b7b7f1dde801def996db181f25a3f1/memsafe/support.c#L96-L115C2) before the current pointer access. The `isSafeToEscapeFunc` routine works by finding the closest base pointer of the given pointer and checks whether the given pointer lies in the bounds, i.e. `[basePointer, basePointer+baseSize)` of the base pointer.
``` c
int *arr = (int *)mymalloc(sizeof(int)*50);
arr[0] = 1;
arr[51] = 1;   // OOB access
*(arr+52) = 1; // OOB access
foo(&arr+53);  // OOB access
```
> Demonstrations of Out-of-bounds pointer accesses.
``` c
int *arr = (int *)mymalloc(sizeof(int)*50);
isSafeToEscapeFunc(arr);    // Pass
arr[0] = 1;
isSafeToEscapeFunc(arr+51); // `Error: invalid pointer\nIssue: pointer out of bounds of base pointer\n`
arr[51] = 1;
isSafeToEscapeFunc(arr+52); // `Error: invalid pointer\nIssue: pointer out of bounds of base pointer\n`
*(arr+52) = 1;
isSafeToEscapeFunc(arr+53); // `Error: invalid pointer\nIssue: pointer out of bounds of base pointer\n`
foo(arr+53);
```
> C equivalent of the updated LLVM IR after passing through the `disallowOutOfBoundsPtr` API.

Lastly, we add write barriers via [addWriteBarriers](https://github.com/hyouteki/cop/blob/8c91b14a81bb1a3a23e77d700422e2ac2c6161ab/memsafe/MemSafe.cpp#L261-L286C2) API to identify instances where invalid heap addresses are getting stored into pointers. This API works by getting the pointer operand from all the store instructions and passing it to a custom [checkWriteBarrier](https://github.com/hyouteki/cop/blob/25c99cc5e4b7b7f1dde801def996db181f25a3f1/memsafe/support.c#L117-L141C2) routine which validates the heap address. This API also works if we store to an object which contains a pointer operand.
``` c
int *ptr = (int *)mymalloc(sizeof(int)*50);                  // valid address
int *a = (int *)0;                                           // invalid address
LinkedListNode node = {.Value=1, .Next=(LinkedListNode *)0}; // invalid address
```
> Demonstration of invalid address. The address 0 is getting stored in the variable `a`, which is invalid. The same is true for the variable `node`, where address 0 is getting stored in the `Next` field, which is invalid.
``` c
int *ptr = (int *)mymalloc(sizeof(int)*50);
checkWriteBarrier(ptr); // Pass
checkWriteBarrier((int *)0);
int *a = (int *)0;      // `Error: invalid pointer (int *)0 found inside (int *)0\n`
checkWriteBarrier((LinkedListNode){.Value=1, .Next=(LinkedListNode *)0});
// `Error: invalid pointer (LinkedListNode *)0 found inside (LinkedListNode){.Value=1, .Next=(LinkedListNode *)0}\n`
LinkedListNode node = {.Value=1, .Next=(LinkedListNode *)0};
```
> C equivalent of the updated LLVM IR after passing through the `addWriteBarriers` API.

## Miscellaneous
> **Note**: We can also use a custom null pointer dereference detection compiler pass in conjunction with this pass for added type safety for C lang. Which can be found [here](#null-pointer-dereference-detection-compiler-pass).

<br>
<a class="inline-button" href="https://github.com/hyouteki/cop" style="margin: 10px;">Repository</a>
<a class="inline-button" href="https://github.com/hyouteki/cop/blob/main/LICENSE" style="margin: 10px;">License GPL-3.0</a> 
