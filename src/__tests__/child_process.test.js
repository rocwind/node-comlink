const { fork } = require('child_process');
const { NodeMessageAdapter, patchMessageChannel } = require('../../lib/child_process');
patchMessageChannel(); // need patch it before load comlink
const Comlink = require('comlinkjs/umd/comlink.js');


let worker = null;
beforeEach(() => {
    worker = fork(`${__dirname}/child_process.worker.js`);
});

afterEach(() => {
    if (worker) {
        worker.kill();
        worker = null;
    }
});


it('worker echoes input value back', async () => {
    const WorkerClass = Comlink.proxy(new NodeMessageAdapter(worker));
    const instance = await new WorkerClass();
    const value = 1;
    const result = await instance.echo(value);
    expect(result).toEqual(value);
});

it('worker create proxy value that echoes input value back', async () => {
    const WorkerClass = Comlink.proxy(new NodeMessageAdapter(worker));
    const instance = await new WorkerClass();
    const proxyValue = await instance.createProxyValue();
    const value = 1;
    const result = await proxyValue.echo(value);
    expect(result).toEqual(value);
});

it('worker execute callback with given value', async done => {
    const WorkerClass = Comlink.proxy(new NodeMessageAdapter(worker));
    const instance = await new WorkerClass();
    const value = 1;
    instance.executeCallbackWithValue(Comlink.proxyValue((v) => {
        expect(v).toEqual(value);
        done();
    }), value);
});

it('worker echoes input values in parallel', async () => {
    const WorkerClass = Comlink.proxy(new NodeMessageAdapter(worker));
    const instance = await new WorkerClass();
    const values = [1, 2];
    const results = await Promise.all(values.map(instance.echo));
    expect(results).toEqual(values);
});
