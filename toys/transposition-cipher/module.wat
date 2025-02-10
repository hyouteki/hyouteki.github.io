(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (result i32)))
  (func $hash (type 0) (param i32) (result i32)
    (local i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        i32.load8_u
        local.tee 1
        br_if 0 (;@2;)
        i32.const 5381
        local.set 0
        br 1 (;@1;)
      end
      local.get 0
      i32.const 1
      i32.add
      local.set 2
      i32.const 5381
      local.set 0
      loop  ;; label = @2
        local.get 0
        i32.const 33
        i32.mul
        local.get 1
        i32.const 24
        i32.shl
        i32.const 24
        i32.shr_s
        i32.add
        local.set 0
        local.get 2
        i32.load8_u
        local.set 1
        local.get 2
        i32.const 1
        i32.add
        local.set 2
        local.get 1
        br_if 0 (;@2;)
      end
    end
    i32.const 19
    local.set 1
    loop  ;; label = @1
      local.get 1
      i32.const 1024
      i32.add
      local.get 0
      local.get 0
      i32.const 10
      i32.div_u
      local.tee 2
      i32.const 10
      i32.mul
      i32.sub
      i32.const 97
      i32.add
      i32.store8
      local.get 2
      local.set 0
      local.get 1
      i32.const -1
      i32.add
      local.tee 1
      i32.const -1
      i32.ne
      br_if 0 (;@1;)
    end
    i32.const 1024)
  (func $hash_len (type 1) (result i32)
    i32.const 20)
  (memory (;0;) 2)
  (global $__stack_pointer (mut i32) (i32.const 66592))
  (export "memory" (memory 0))
  (export "hash" (func $hash))
  (export "hash_len" (func $hash_len)))
