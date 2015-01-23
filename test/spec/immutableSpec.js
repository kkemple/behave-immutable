import BehaveImmutable from '../../src/index';

describe('BehaveImmutable', () => {
    beforeEach(() => {
        this.bi = new BehaveImmutable();
    });

    describe('.get()', () => {
        it('should be defined', (done) => {
            expect(this.bi.get).toBeDefined();
            done();
        });

        it('should return the latest state, or `undefined` if no state in the stack',
                done => {

            expect(this.bi.get()).not.toBeDefined();
            this.bi.set({test: 'test'});
            expect(this.bi.get()).toBeDefined();
            done();
        });
    });

    describe('.set(state, opts)', () => {
        it('should be defined', (done) => {
            expect(this.bi.set).toBeDefined();
            done();
        });

        it('should update its data and set a new state in the stack',
                done => {

            this.bi.set({test: 'test'});
            expect(this.bi.count()).toEqual(1);
            this.bi.set({test: 'test2'});
            expect(this.bi.count()).toEqual(2);
            done();
        });

        it('should emit a `change` event when a new state is pushed on to the stack',
                done => {

            let spy = jasmine.createSpy('changeEmit');
            this.bi.on('change', spy);
            this.bi.set({test: 'test'});
            expect(spy).toHaveBeenCalledWith({test: 'test'});
            done();
        });

        it('should not emit a `change` event is silent option is set to `true`',
                done => {

            let spy = jasmine.createSpy('changeEmit');
            this.bi.on('change', spy);
            this.bi.set({test: 'test'}, {silent: true});
            expect(spy).not.toHaveBeenCalled();
            done();
        });

        it('should replace last item in stack if `replace` option is set to `true`',
                done => {

            this.bi.set({test: 'test'});
            expect(this.bi.count()).toEqual(1);
            this.bi.set({test: 'test2'}, {replace: true});
            expect(this.bi.count()).toEqual(1);
            done();
        });
    });

    describe('.pop()', () => {
        it('should be defined', done => {
            expect(this.bi.pop).toBeDefined();
            done();
        });

        it('should pop the latest state from the stack,' +
            'or return `undefined` if no state in the stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            expect(this.bi.pop()).toBeDefined();
            expect(this.bi.count()).toEqual(1);
            expect(this.bi.get().toJS().test).toEqual('test');
            done();
        });
    });

    describe('.pop()', () => {
        it('should be defined', done => {
            expect(this.bi.shift).toBeDefined();
            done();
        });

        it('should shift the latest state from the stack,' +
            'or return `undefined` if no state in the stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            expect(this.bi.shift()).toBeDefined();
            expect(this.bi.count()).toEqual(1);
            expect(this.bi.get().toJS().test).toEqual('test2');
            done();
        });
    });

    describe('.at(id)', () => {
        it('should be defined', done => {
            expect(this.bi.at).toBeDefined();
            done();
        });

        it('should return state at specified index, ' +
            'or return `undefined` if no state in the stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            expect(this.bi.at(1)).toBeDefined();
            expect(this.bi.at(1).toJS().test).toEqual('test2');
            done();
        });
    });

    describe('.range(startIndex, endIndex)', () => {
        it('should be defined', done => {
            expect(this.bi.range).toBeDefined();
            done();
        });

        it('should return states at specified range,' +
            'or return `undefined` if no state in the stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            this.bi.set({test: 'test3'});
            this.bi.set({test: 'test4'});
            this.bi.set({test: 'test5'});
            let states = this.bi.range(0, 2);
            expect(states.length).toEqual(3);
            expect(states[0].toJS().test).toEqual('test');
            expect(states[1].toJS().test).toEqual('test2');
            expect(states[2].toJS().test).toEqual('test3');
            done();
        });
    });

    describe('.count()', () => {
        it('should be defined', done => {
            expect(this.bi.count).toBeDefined();
            done();
        });

        it('should return count of states stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            expect(this.bi.count()).toEqual(2);
            this.bi.pop();
            expect(this.bi.count()).toEqual(1);
            done();
        });
    });

    describe('.purge()', () => {
        it('should be defined', done => {
            expect(this.bi.purge).toBeDefined();
            done();
        });

        it('should empty the stack',
                done => {

            this.bi.set({test: 'test'});
            this.bi.set({test: 'test2'});
            this.bi.set({test: 'test3'});
            this.bi.set({test: 'test4'});
            this.bi.set({test: 'test5'});
            expect(this.bi.count()).toEqual(5);
            this.bi.purge();
            expect(this.bi.count()).toEqual(0);
            done();
        });
    });

    describe('.toJS()', () => {
        it('should be defined', done => {
            expect(this.bi.toJS).toBeDefined();
            done();
        });

        it('should return object literal of current state',
                done => {

            let obj = {test: 'test'};
            this.bi.set(obj);
            expect(this.bi.toJS()).toEqual(obj);
            done();
        });
    });

    describe('.toJSON()', () => {
        it('should be defined', done => {
            expect(this.bi.toJSON).toBeDefined();
            done();
        });

        it('should return JSON representation of current state',
                done => {

            let obj = {test: 'test'};
            this.bi.set(obj);
            expect(this.bi.toJSON()).toEqual(JSON.stringify(obj));
            done();
        });
    });

    describe('.serialize(opts)', () => {
        it('should be defined', done => {
            expect(this.bi.serialize).toBeDefined();
            done();
        });

        it('should return serialized string representation of current state',
                done => {

            let obj = {test: 'test'};
            this.bi.set(obj);
            expect(this.bi.serialize()).toEqual('test=test');
            done();
        });

        it('should wrap prop value in `[]` and serialize if value is an object',
                done => {

            let obj = {test: 'test', nested: {example: 'example'}};
            this.bi.set(obj);
            expect(this.bi.serialize()).toEqual('test=test&nested=[example=example]');
            done();
        });
    });
});
