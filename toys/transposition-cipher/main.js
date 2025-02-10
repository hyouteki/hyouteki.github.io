import * as Common from "./js/common.js";

const context = {};

const memory = new WebAssembly.Memory({ initial: 1 });
WebAssembly.instantiateStreaming(fetch("module.wasm"), {
    env: {
		memory: memory,
        __stack_pointer: new WebAssembly.Global({ value: "i32", mutable: true }, 0),
		print: (text) => console.log(Common.cstrFromPtr(context.wasm, text)),
		printd: (num) => console.log(num),
		cstrlen: (text) => Common.cstrlen(context.wasm, text),
	}
}).then((wasm) => {
    console.log("INFO: wasm module loaded");
    context.wasm = wasm;
	context.offset = 0;
	// Allocating offset
	context.offsets = {};
	context.offsets.TEXT = context.offset; context.offset += 1024;
}).catch((err) => {
    console.error("ERROR: could not load WebAssembly module:", err);
});

modeChanged();
document.getElementById("mode").addEventListener("change", modeChanged);

document.getElementById("execute-btn").addEventListener("click", () => {
	switch (document.getElementById("mode").value) {
	case "encrypt":
		break;
	case "decrypt":
		break;
	case "hash":
		Common.writeStringToMemory(context.wasm, document.getElementById("text").value, context.offset.TEXT);
		document.getElementById("result").innerHTML = Common.cstrFromPtr(
			context.wasm, context.wasm.instance.exports.hash(context.offset.TEXT));
		break;
	case "brute":
		break;
	default:
		throw new Error("Invalid mode");
	}
});

function modeChanged() {
    switch (document.getElementById("mode").value) {
	case "encrypt":
	case "decrypt":
		document.getElementById("key").style.display = "block";
		break;
	case "hash":
	case "brute":
		document.getElementById("key").style.display = "none";
		break;
	default:
		throw new Error("Invalid mode");
	}
}


