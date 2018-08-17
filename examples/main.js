const { Worker } = require('worker_threads');
const { NodeMainThreadMessageAdapter, patchMessageChannel } = require('../index');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlink/umd/comlink.js');

const worker = new Worker(`${__dirname}/worker.js`);

async function f() {
    const MyClass = Comlink.proxy(new NodeMainThreadMessageAdapter(worker));
    // `instance` is an instance of `MyClass` that lives in the worker!
    const instance = await new MyClass();
    await instance.logSomething(); // logs “myValue = 42”
};

f();


