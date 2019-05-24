import { Endpoint } from "comlink";
import { EventEmitter } from "events";

// handle the difference between EventEmitter(node) and EventTarget(web)
const proxyByListener: WeakMap<Function, Function> = new WeakMap();

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EndpointEventEmitter = Omit<Endpoint, 'postMessage'>;

export function applyEventAdapter<T>(target: T, emitter?: EventEmitter): T & EndpointEventEmitter {
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
    return target as T & EndpointEventEmitter;
}

export function patchCommon() {
    (<any>global).self = global;
}
