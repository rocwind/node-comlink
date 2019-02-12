// Example with worker_threads
// https://nodejs.org/api/worker_threads.html
// NOTE: worker threads is a new feature added in node.js 10.5.0 and still in experimental
// it needs extra flag to enable worker threads feature and run this example
// node --experimental-worker main.js

const { Worker } = require('worker_threads');
const { NodeMessageAdapter, patchMessageChannel } = require('../../lib/worker_threads');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlinkjs/umd/comlink.js');

const worker = new Worker(`${__dirname}/worker.js`);

async function f() {
    const MyClass = Comlink.proxy(new NodeMessageAdapter(worker));
    // `instance` is an instance of `MyClass` that lives in the worker!
    const instance = await new MyClass();
    await instance.logSomething(); // logs “myValue = 42”

    worker.terminate();
};

f();
