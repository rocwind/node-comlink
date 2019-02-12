import { Endpoint } from 'comlinkjs';
import { wrap, StringMessageChannel } from 'comlinkjs/umd/messagechanneladapter';
import { ChildProcess } from 'child_process';
import { applyEventAdapter, patchCommon } from './common';
import { MessageChannelPolyfill, MessagePortPolyfill } from './polyfill';

export class NodeMessageAdapter implements Endpoint {
    wrap: Endpoint = null;

    constructor(worker?: ChildProcess) {
        // use child process id as wrap id
        let wrapId: string = '';
        let smc: StringMessageChannel = null;
        if (worker) {
            wrapId = `${worker.pid}`;
            // main process
            smc = applyEventAdapter(<any>{
                send(message) {
                    worker.send(message);
                }
            }, worker);
        } else {
            // child process
            wrapId = `${process.pid}`;
            smc = applyEventAdapter(<any>{
                send(message) {
                    process.send(message);
                },
            }, process);
        }

        this.wrap = wrap(smc, wrapId);
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

export function patchMessageChannel() {
    patchCommon();
    (<any>global).MessageChannel = MessageChannelPolyfill;
    (<any>global).MessagePort = MessagePortPolyfill;
}
