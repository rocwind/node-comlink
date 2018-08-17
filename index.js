const { MessageChannel, MessagePort, parentPort } = require('worker_threads');

// handle the difference between EventEmitter(node) and EventTarget(web)
const proxyByListener = new WeakMap();
function applyEventAdapter(target, emitter) {
    Object.assign(target, {
        addEventListener: function(type, listener) {
            const proxy = function(data) {
                listener({ data });
            }
            proxyByListener.set(listener, proxy);
            (emitter || this).addListener(type, proxy);
        },
        removeEventListener: function(type, listener) {
            const proxy = proxyByListener.get(listener);
            if (!proxy) {
                return;
            }
            proxyByListener.delete(listener);
            (emitter || this).removeListener(type, proxy);
        },
    });
}

// adapter for main thread
class NodeMainThreadMessageAdapter {
    constructor(worker) {
        this.worker = worker;
        applyEventAdapter(this, worker);
    }

    postMessage(message, transferList) {
        this.worker.postMessage(message, transferList);
    }
}

// adapter for worker
class NodeWorkerThreadMessageAdapter {
    constructor() {
        applyEventAdapter(this, parentPort);
    }

    postMessage(message, transferList) {
        parentPort.postMessage(message, transferList);
    }
}

function patchMessageChannel() {
    global.MessageChannel = MessageChannel;
    global.MessagePort = MessagePort;
    applyEventAdapter(MessagePort.prototype);
}

module.exports = {
    NodeMainThreadMessageAdapter,
    NodeWorkerThreadMessageAdapter,
    patchMessageChannel,
}
