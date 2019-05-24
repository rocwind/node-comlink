import { MessageChannel, MessagePort, parentPort, Worker } from 'worker_threads';
import { applyEventAdapter, patchCommon, EndpointEventEmitter } from './common';
import { Endpoint } from 'comlink';

// adapter for main thread
export class NodeMessageAdapter implements Endpoint {
    private worker: Worker | MessagePort = null;
    private eventEmitter: EndpointEventEmitter = null;

    constructor(worker?: Worker) {
        this.worker = worker || parentPort;
        this.eventEmitter = applyEventAdapter({}, this.worker);
    }

    postMessage(message, transferList) {
        this.worker.postMessage(message, transferList);
    }

    addEventListener(type, listener) {
        this.eventEmitter.addEventListener(type, listener);
    }

    removeEventListener(type, listener) {
        this.eventEmitter.removeEventListener(type, listener)
    }
}

export function patchMessageChannel() {
    patchCommon();
    (<any>global).MessageChannel = MessageChannel;
    (<any>global).MessagePort = MessagePort;
    applyEventAdapter(MessagePort.prototype);
}
