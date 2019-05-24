// Example with child process
// https://nodejs.org/api/child_process.html
const { fork } = require('child_process');
const { NodeMessageAdapter, patchMessageChannel } = require('../../lib/child_process');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlink/umd/comlink.js');

const worker = fork(`${__dirname}/worker.js`);

async function f() {
    const MyClass = Comlink.proxy(new NodeMessageAdapter(worker));
    // `instance` is an instance of `MyClass` that lives in the worker!
    const instance = await new MyClass();
    await instance.logSomething(); // logs “myValue = 42”

    worker.kill();
};

f();
