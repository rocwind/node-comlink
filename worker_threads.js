const { MessageChannel, MessagePort, parentPort } = require('worker_threads');
const { applyEventAdapter, patchCommon } = require('./common');

// adapter for main thread
class NodeMessageAdapter {
    constructor(worker) {
        this.worker = worker || parentPort;
        applyEventAdapter(this, this.worker);
    }

    postMessage(message, transferList) {
        this.worker.postMessage(message, transferList);
    }
}

function patchMessageChannel() {
    patchCommon();
    global.MessageChannel = MessageChannel;
    global.MessagePort = MessagePort;
    applyEventAdapter(MessagePort.prototype);
}

module.exports = {
    NodeMessageAdapter,
    patchMessageChannel,
}
