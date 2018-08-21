# node-comlink
An adapter for node child process or worker threads to work with [Comlink](https://github.com/GoogleChromeLabs/comlink)

## Install
`npm i --save node-comlink`

## Usage
```
// main.js
const { fork } = require('child_process');
const { NodeMessageAdapter, patchMessageChannel } = require('node-comlink');
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
```

```
// worker.js
const { NodeMessageAdapter, patchMessageChannel } = require('node-comlink');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlink/umd/comlink.js');

const myValue = 42;
class MyClass {
    logSomething() {
        console.log(`myValue = ${myValue}`);
    }
}

Comlink.expose(MyClass, new NodeMessageAdapter());
```

## Child Process and Worker Threads
Worker Threads is a new feature added in node 10.5.0, it comes with native MessageChannel/MessagePort/Transferable support. But it is still an experimental feature and needs `--experimental-worker` flag to enable, e.g. `node --experimental-worker main.js`. Therefore Child Process is the default option currently.

```
// To go with Worker Threads:
const { NodeMessageAdapter, patchMessageChannel } = require('node-comlink/worker_threads');
```

## Examples
* [child process](examples/child_process)
* [worker threads](examples/worker_threads)