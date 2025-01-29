export function cstrlen(wasm, ptr) {
    const memory = new Uint8Array(wasm.instance.exports.memory.buffer);
    let len = 0;
    while (memory[ptr] !== 0) {
        len++;
        ptr++;
    }
    return len;
}

export function cstrFromPtr(wasm, ptr) {
    const mem = new Uint8Array(wasm.instance.exports.memory.buffer);
    const len = cstrlen(wasm, ptr);
    const bytes = new Uint8Array(wasm.instance.exports.memory.buffer, ptr, len);
    return new TextDecoder().decode(bytes);
}

export function writeStringToMemory(wasm, string, offset) {
    const encoder = new TextEncoder();
    const encodedStr = encoder.encode(string + '\0');
    const memory = new Uint8Array(wasm.instance.exports.memory.buffer);
    memory.set(encodedStr, offset);
    return offset;
}
