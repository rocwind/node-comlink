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

module.exports = {
    applyEventAdapter,
}
