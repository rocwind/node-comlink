const { NodeWorkerThreadMessageAdapter, patchMessageChannel } = require('../index');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlink/umd/comlink.js');

const myValue = 42;
class MyClass {
    logSomething() {
        console.log(`myValue = ${myValue}`);
    }
}

Comlink.expose(MyClass, new NodeWorkerThreadMessageAdapter());

