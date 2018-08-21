const { NodeMessageAdapter, patchMessageChannel } = require('../../child_process');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlinkjs/umd/comlink.js');

const myValue = 42;
class MyClass {
    logSomething() {
        console.log(`myValue = ${myValue}`);
    }
}

Comlink.expose(MyClass, new NodeMessageAdapter());
