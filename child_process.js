const { applyEventAdapter, patchCommon } = require('./common');
const { wrap } = require('comlinkjs/umd/messagechanneladapter');

class NodeMessageAdapter {
    constructor(worker) {
        // use child process id as wrap id
        let wrapId = '';
        if (worker) {
            wrapId = worker.pid;
            // main process
            applyEventAdapter(worker, worker);
        } else {
            // child process
            wrapId = process.pid;
            worker = {
                send(message) {
                    process.send(message);
                },
            };
            applyEventAdapter(worker, process);
        }

        this.wrap = wrap(worker, wrapId);
    }

    postMessage(message, transferList) {
        this.wrap.postMessage(message);
    }
    addEventListener(type, listener) {
        this.wrap.addEventListener(type, listener);
    }
    removeEventListener(type, listener) {
        this.wrap.removeEventListener(type, listener);
    }
}

// polyfill MessagePort and MessageChannel
class MessagePort {
    constructor() {
        this.otherPort = null;
        this.onmessage = null;
    }

    postMessage(message) {
        if (this.otherPort && this.otherPort.onmessage) {
            this.otherPort.onmessage({ data: message });
        }
    }

    addEventListener(type, listener) {
        this.onmessage = listener;
    }

    removeEventListener() {
        this.onmessage = null;
    }

    start() {
        // do nothing at this moment
    }
}

class MessageChannel {
    constructor() {
        this.port1 = new MessagePort();
        this.port2 = new MessagePort();
        this.port1.otherPort = this.port2;
        this.port2.otherPort = this.port1;
    }
}


function patchMessageChannel() {
    patchCommon();
    global.MessageChannel = MessageChannel;
    global.MessagePort = MessagePort;
}

module.exports = {
    NodeMessageAdapter,
    patchMessageChannel,
}
