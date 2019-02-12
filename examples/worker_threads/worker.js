const { NodeMessageAdapter, patchMessageChannel } = require('../../lib/worker_threads');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlinkjs/umd/comlink.js');

const myValue = 42;
class MyClass {
    logSomething() {
        console.log(`myValue = ${myValue}`);
    }
}

Comlink.expose(MyClass, new NodeMessageAdapter());
