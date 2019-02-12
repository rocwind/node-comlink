const { NodeMessageAdapter, patchMessageChannel } = require('../../lib/child_process');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlinkjs/umd/comlink.js');


class Worker {
    echo(value) {
        return value;
    }

    createProxyValue() {
        return Comlink.proxyValue(new Worker());
    }

    executeCallbackWithValue(callback, value) {
        callback(value);
    }
}

Comlink.expose(Worker, new NodeMessageAdapter());
